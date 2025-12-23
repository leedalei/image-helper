package editor

import (
	"archive/zip"
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/disintegration/imaging"
	"golang.org/x/image/font"
	"golang.org/x/image/font/basicfont"
	"golang.org/x/image/math/fixed"
)

// Service 图片编辑服务实现
type Service struct{}

// NewService 创建新的编辑服务
func NewService() *Service {
	return &Service{}
}

// Resize 调整图片尺寸
func (s *Service) Resize(data []byte, width, height int, keepAspectRatio bool) ([]byte, error) {
	// 解码图片
	img, err := imaging.Decode(bytes.NewReader(data), imaging.AutoOrientation(true))
	if err != nil {
		return nil, fmt.Errorf("解码图片失败: %w", err)
	}

	// 获取原始尺寸
	bounds := img.Bounds()
	origWidth := bounds.Max.X
	origHeight := bounds.Max.Y

	// 计算目标尺寸
	targetWidth, targetHeight := s.calculateTargetSize(origWidth, origHeight, width, height, keepAspectRatio)

	// 缩放图片
	resized := imaging.Resize(img, targetWidth, targetHeight, imaging.Lanczos)

	// 编码为PNG
	var buf bytes.Buffer
	if err := imaging.Encode(&buf, resized, imaging.PNG); err != nil {
		return nil, fmt.Errorf("编码图片失败: %w", err)
	}

	return buf.Bytes(), nil
}

// Rotate 旋转图片
func (s *Service) Rotate(data []byte, angle int) ([]byte, error) {
	// 解码图片
	img, err := imaging.Decode(bytes.NewReader(data), imaging.AutoOrientation(true))
	if err != nil {
		return nil, fmt.Errorf("解码图片失败: %w", err)
	}

	// 旋转图片
	rotated := imaging.Rotate(img, float64(angle), image.Transparent)

	// 编码为PNG
	var buf bytes.Buffer
	if err := imaging.Encode(&buf, rotated, imaging.PNG); err != nil {
		return nil, fmt.Errorf("编码图片失败: %w", err)
	}

	return buf.Bytes(), nil
}

// AddImageWatermark 添加图片水印
func (s *Service) AddImageWatermark(data []byte, watermark []byte, options WatermarkOptions) ([]byte, error) {
	// 解码原始图片
	srcImg, err := imaging.Decode(bytes.NewReader(data), imaging.AutoOrientation(true))
	if err != nil {
		return nil, fmt.Errorf("解码原始图片失败: %w", err)
	}

	// 解码水印图片
	watermarkImg, err := imaging.Decode(bytes.NewReader(watermark), imaging.AutoOrientation(true))
	if err != nil {
		return nil, fmt.Errorf("解码水印图片失败: %w", err)
	}

	// 应用透明度到水印图片
	if options.Opacity < 1.0 {
		watermarkImg = s.applyOpacity(watermarkImg, options.Opacity)
	}

	// 获取图片尺寸
	srcBounds := srcImg.Bounds()
	srcWidth := srcBounds.Max.X
	srcHeight := srcBounds.Max.Y
	wmBounds := watermarkImg.Bounds()
	wmWidth := wmBounds.Max.X
	wmHeight := wmBounds.Max.Y

	// 创建目标图片
	dst := image.NewRGBA(srcBounds)
	draw.Draw(dst, srcBounds, srcImg, image.Point{}, draw.Src)

	// 根据位置添加水印
	if options.Position == PositionTile {
		// 平铺水印
		spacing := s.getDensitySpacing(options.Density, wmWidth, wmHeight)
		for y := 0; y < srcHeight; y += wmHeight + spacing {
			for x := 0; x < srcWidth; x += wmWidth + spacing {
				pt := image.Point{X: -x, Y: -y}
				draw.Draw(dst, image.Rect(x, y, x+wmWidth, y+wmHeight), watermarkImg, pt, draw.Over)
			}
		}
	} else {
		// 单个水印
		pt := s.calculateWatermarkPosition(srcWidth, srcHeight, wmWidth, wmHeight, options.Position)
		draw.Draw(dst, image.Rect(pt.X, pt.Y, pt.X+wmWidth, pt.Y+wmHeight), watermarkImg, image.Point{}, draw.Over)
	}

	// 编码为PNG
	var buf bytes.Buffer
	if err := imaging.Encode(&buf, dst, imaging.PNG); err != nil {
		return nil, fmt.Errorf("编码图片失败: %w", err)
	}

	return buf.Bytes(), nil
}

// AddTextWatermark 添加文本水印
func (s *Service) AddTextWatermark(data []byte, text string, options TextWatermarkOptions) ([]byte, error) {
	// 解码原始图片
	srcImg, err := imaging.Decode(bytes.NewReader(data), imaging.AutoOrientation(true))
	if err != nil {
		return nil, fmt.Errorf("解码原始图片失败: %w", err)
	}

	// 获取图片尺寸
	srcBounds := srcImg.Bounds()
	srcWidth := srcBounds.Max.X
	srcHeight := srcBounds.Max.Y

	// 创建目标图片
	dst := image.NewRGBA(srcBounds)
	draw.Draw(dst, srcBounds, srcImg, image.Point{}, draw.Src)

	// 解析字体颜色
	fontColor := s.parseColor(options.FontColor, options.Opacity)

	// 计算文本尺寸（使用基本字体）
	textWidth := len(text) * 7  // basicfont.Face7x13 宽度约为7
	textHeight := 13            // basicfont.Face7x13 高度为13

	// 根据字体大小缩放
	scale := float64(options.FontSize) / 13.0
	if scale < 1 {
		scale = 1
	}
	textWidth = int(float64(textWidth) * scale)
	textHeight = int(float64(textHeight) * scale)

	// 根据位置添加水印
	if options.Position == PositionTile {
		// 平铺水印
		spacing := s.getDensitySpacing(options.Density, textWidth, textHeight)
		for y := textHeight; y < srcHeight+textHeight; y += textHeight + spacing {
			for x := 0; x < srcWidth; x += textWidth + spacing {
				s.drawText(dst, text, x, y, fontColor)
			}
		}
	} else {
		// 单个水印
		pt := s.calculateWatermarkPosition(srcWidth, srcHeight, textWidth, textHeight, options.Position)
		s.drawText(dst, text, pt.X, pt.Y+textHeight, fontColor)
	}

	// 编码为PNG
	var buf bytes.Buffer
	if err := imaging.Encode(&buf, dst, imaging.PNG); err != nil {
		return nil, fmt.Errorf("编码图片失败: %w", err)
	}

	return buf.Bytes(), nil
}

// BatchEdit 批量编辑
func (s *Service) BatchEdit(req BatchEditRequest) (*BatchEditResponse, error) {
	numImages := len(req.Images)
	if numImages == 0 {
		return &BatchEditResponse{
			Results:      []EditResult{},
			SuccessCount: 0,
			FailedCount:  0,
		}, nil
	}

	// 使用channel收集结果
	type editResultWithIndex struct {
		index  int
		result *EditResult
		err    error
	}

	resultChan := make(chan editResultWithIndex, numImages)
	var wg sync.WaitGroup

	// 并发处理每张图片
	for i, imgData := range req.Images {
		wg.Add(1)
		go func(index int, data []byte) {
			defer wg.Done()
			result, err := s.processImage(data, req.Options)
			resultChan <- editResultWithIndex{
				index:  index,
				result: result,
				err:    err,
			}
		}(i, imgData)
	}

	// 等待所有goroutine完成后关闭channel
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// 收集结果
	results := make([]EditResult, numImages)
	successCount := 0
	failedCount := 0
	validResults := make([]bool, numImages)

	for res := range resultChan {
		if res.err != nil {
			failedCount++
			continue
		}
		results[res.index] = *res.result
		validResults[res.index] = true
		successCount++
	}

	// 过滤出有效结果（保持原始顺序）
	finalResults := make([]EditResult, 0, successCount)
	for i, valid := range validResults {
		if valid {
			finalResults = append(finalResults, results[i])
		}
	}

	return &BatchEditResponse{
		Results:      finalResults,
		SuccessCount: successCount,
		FailedCount:  failedCount,
	}, nil
}

// processImage 处理单张图片
func (s *Service) processImage(data []byte, options EditOptions) (*EditResult, error) {
	var processedData []byte = data
	var operations []string
	var err error

	// 应用尺寸调整
	if options.Resize != nil {
		processedData, err = s.Resize(
			processedData,
			options.Resize.Width,
			options.Resize.Height,
			options.Resize.KeepAspectRatio,
		)
		if err != nil {
			return nil, fmt.Errorf("尺寸调整失败: %w", err)
		}
		operations = append(operations, "resize")
	}

	// 应用旋转
	if options.Rotate != nil && options.Rotate.Angle != 0 {
		processedData, err = s.Rotate(processedData, options.Rotate.Angle)
		if err != nil {
			return nil, fmt.Errorf("旋转失败: %w", err)
		}
		operations = append(operations, "rotate")
	}

	// 应用图片水印
	if options.Watermark != nil && options.WatermarkImage != nil {
		processedData, err = s.AddImageWatermark(processedData, options.WatermarkImage, *options.Watermark)
		if err != nil {
			return nil, fmt.Errorf("添加图片水印失败: %w", err)
		}
		operations = append(operations, "image_watermark")
	}

	// 应用文本水印
	if options.TextWater != nil && options.TextWater.Text != "" {
		processedData, err = s.AddTextWatermark(processedData, options.TextWater.Text, *options.TextWater)
		if err != nil {
			return nil, fmt.Errorf("添加文本水印失败: %w", err)
		}
		operations = append(operations, "text_watermark")
	}

	// 获取处理后的图片尺寸
	img, _, err := image.DecodeConfig(bytes.NewReader(processedData))
	if err != nil {
		return nil, fmt.Errorf("获取图片尺寸失败: %w", err)
	}

	return &EditResult{
		Data:       processedData,
		Width:      img.Width,
		Height:     img.Height,
		Format:     FormatPNG,
		Operations: operations,
	}, nil
}

// Save 保存编辑结果
func (s *Service) Save(result *EditResult, options SaveOptions) (string, error) {
	// 确保目录存在
	if err := os.MkdirAll(options.Path, 0755); err != nil {
		return "", fmt.Errorf("创建目录失败: %w", err)
	}

	// 处理文件名，添加_edited后缀
	filename := options.Filename
	ext := filepath.Ext(filename)
	if ext == "" {
		// 根据输出格式确定扩展名
		ext = s.getExtensionForFormat(result.Format)
		filename = filename + "_edited" + ext
	} else {
		// 在扩展名前添加_edited后缀
		nameWithoutExt := filename[:len(filename)-len(ext)]
		// 保持原始格式的扩展名
		filename = nameWithoutExt + "_edited" + ext
	}

	// 构建完整的文件路径
	fullPath := filepath.Join(options.Path, filename)

	// 检查文件是否已存在
	if !options.Overwrite {
		if _, err := os.Stat(fullPath); err == nil {
			return "", fmt.Errorf("文件已存在: %s", fullPath)
		}
	}

	// 写入文件
	if err := os.WriteFile(fullPath, result.Data, 0644); err != nil {
		return "", fmt.Errorf("保存文件失败: %w", err)
	}

	return fullPath, nil
}

// BatchSaveToZip 批量保存到ZIP文件
func (s *Service) BatchSaveToZip(results []*EditResult, options BatchSaveOptions) (string, error) {
	// 确保目录存在
	if err := os.MkdirAll(options.ZipPath, 0755); err != nil {
		return "", fmt.Errorf("创建目录失败: %w", err)
	}

	// 生成带时间戳的ZIP文件名（如果未指定）
	zipFilename := options.ZipFilename
	if zipFilename == "" {
		timestamp := time.Now().Format("20060102_150405")
		zipFilename = fmt.Sprintf("edited_images_%s.zip", timestamp)
	}

	// 构建完整的ZIP文件路径
	zipPath := filepath.Join(options.ZipPath, zipFilename)

	// 创建ZIP文件
	w, err := os.Create(zipPath)
	if err != nil {
		return "", fmt.Errorf("创建ZIP文件失败: %w", err)
	}
	defer w.Close()

	zipWriter := zip.NewWriter(w)
	defer zipWriter.Close()

	// 添加文件到ZIP
	for i, result := range results {
		// 获取文件名
		var filename string
		if i < len(options.Filenames) && options.Filenames[i] != "" {
			// 使用提供的文件名，添加_edited后缀
			baseName := options.Filenames[i]
			ext := filepath.Ext(baseName)
			nameWithoutExt := baseName[:len(baseName)-len(ext)]

			// 保持原始格式的扩展名
			if ext == "" {
				ext = s.getExtensionForFormat(result.Format)
			}

			filename = nameWithoutExt + "_edited" + ext
		} else {
			// 生成默认文件名
			ext := s.getExtensionForFormat(result.Format)
			filename = fmt.Sprintf("image_%d_edited%s", i+1, ext)
		}

		// 添加文件到ZIP
		f, err := zipWriter.Create(filename)
		if err != nil {
			return "", fmt.Errorf("创建ZIP文件项失败: %w", err)
		}

		// 写入文件数据
		if _, err := f.Write(result.Data); err != nil {
			return "", fmt.Errorf("写入ZIP文件数据失败: %w", err)
		}
	}

	return zipPath, nil
}

// getExtensionForFormat 根据图片格式获取文件扩展名
func (s *Service) getExtensionForFormat(format ImageFormat) string {
	switch format {
	case FormatJPEG:
		return ".jpg"
	case FormatPNG:
		return ".png"
	case FormatWebP:
		return ".webp"
	case FormatGIF:
		return ".gif"
	case FormatBMP:
		return ".bmp"
	case FormatTIFF:
		return ".tiff"
	default:
		return ".png"
	}
}

// calculateTargetSize 计算目标尺寸
func (s *Service) calculateTargetSize(
	origWidth, origHeight,
	targetWidth, targetHeight int,
	keepAspectRatio bool,
) (int, int) {
	// 如果没有指定目标尺寸，保持原尺寸
	if targetWidth == 0 && targetHeight == 0 {
		return origWidth, origHeight
	}

	// 如果只指定了宽度
	if targetHeight == 0 {
		if !keepAspectRatio {
			return targetWidth, origHeight
		}
		ratio := float64(targetWidth) / float64(origWidth)
		return targetWidth, int(float64(origHeight) * ratio)
	}

	// 如果只指定了高度
	if targetWidth == 0 {
		if !keepAspectRatio {
			return origWidth, targetHeight
		}
		ratio := float64(targetHeight) / float64(origHeight)
		return int(float64(origWidth) * ratio), targetHeight
	}

	// 两个都指定了
	if !keepAspectRatio {
		return targetWidth, targetHeight
	}

	// 保持宽高比，取较严格的限制
	widthRatio := float64(targetWidth) / float64(origWidth)
	heightRatio := float64(targetHeight) / float64(origHeight)
	ratio := widthRatio
	if heightRatio < ratio {
		ratio = heightRatio
	}

	return int(float64(origWidth) * ratio), int(float64(origHeight) * ratio)
}

// applyOpacity 应用透明度到图片
func (s *Service) applyOpacity(img image.Image, opacity float64) image.Image {
	bounds := img.Bounds()
	dst := image.NewRGBA(bounds)

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, a := img.At(x, y).RGBA()
			newA := uint8(float64(a>>8) * opacity)
			dst.Set(x, y, color.RGBA{
				R: uint8(r >> 8),
				G: uint8(g >> 8),
				B: uint8(b >> 8),
				A: newA,
			})
		}
	}

	return dst
}

// calculateWatermarkPosition 计算水印位置
func (s *Service) calculateWatermarkPosition(srcWidth, srcHeight, wmWidth, wmHeight int, position WatermarkPosition) image.Point {
	padding := 10 // 边距

	switch position {
	case PositionTopLeft:
		return image.Point{X: padding, Y: padding}
	case PositionTopRight:
		return image.Point{X: srcWidth - wmWidth - padding, Y: padding}
	case PositionBottomLeft:
		return image.Point{X: padding, Y: srcHeight - wmHeight - padding}
	case PositionBottomRight:
		return image.Point{X: srcWidth - wmWidth - padding, Y: srcHeight - wmHeight - padding}
	case PositionCenter:
		return image.Point{X: (srcWidth - wmWidth) / 2, Y: (srcHeight - wmHeight) / 2}
	default:
		return image.Point{X: padding, Y: padding}
	}
}

// getDensitySpacing 根据密度获取间距
func (s *Service) getDensitySpacing(density WatermarkDensity, wmWidth, wmHeight int) int {
	// 基础间距为水印尺寸的一定比例
	baseSize := wmWidth
	if wmHeight > wmWidth {
		baseSize = wmHeight
	}

	switch density {
	case DensitySparse:
		return baseSize * 2 // 稀疏：间距为水印尺寸的2倍
	case DensityMedium:
		return baseSize     // 适中：间距为水印尺寸
	case DensityDense:
		return baseSize / 2 // 密集：间距为水印尺寸的一半
	default:
		return baseSize
	}
}

// parseColor 解析颜色字符串
func (s *Service) parseColor(colorStr string, opacity float64) color.RGBA {
	// 默认颜色为白色
	c := color.RGBA{R: 255, G: 255, B: 255, A: uint8(255 * opacity)}

	if colorStr == "" {
		return c
	}

	// 移除 # 前缀
	colorStr = strings.TrimPrefix(colorStr, "#")

	// 解析十六进制颜色
	if len(colorStr) == 6 {
		r, _ := strconv.ParseUint(colorStr[0:2], 16, 8)
		g, _ := strconv.ParseUint(colorStr[2:4], 16, 8)
		b, _ := strconv.ParseUint(colorStr[4:6], 16, 8)
		c.R = uint8(r)
		c.G = uint8(g)
		c.B = uint8(b)
		c.A = uint8(255 * opacity)
	} else if len(colorStr) == 8 {
		r, _ := strconv.ParseUint(colorStr[0:2], 16, 8)
		g, _ := strconv.ParseUint(colorStr[2:4], 16, 8)
		b, _ := strconv.ParseUint(colorStr[4:6], 16, 8)
		a, _ := strconv.ParseUint(colorStr[6:8], 16, 8)
		c.R = uint8(r)
		c.G = uint8(g)
		c.B = uint8(b)
		c.A = uint8(float64(a) * opacity)
	}

	return c
}

// drawText 在图片上绘制文本
func (s *Service) drawText(img *image.RGBA, text string, x, y int, c color.RGBA) {
	point := fixed.Point26_6{X: fixed.I(x), Y: fixed.I(y)}

	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(c),
		Face: basicfont.Face7x13,
		Dot:  point,
	}
	d.DrawString(text)
}
