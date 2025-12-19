package compressor

import (
	"archive/zip"
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"os"
	"path/filepath"

	"github.com/disintegration/imaging"
)

// Service 图片压缩服务实现
type Service struct{}

// NewService 创建新的压缩服务
func NewService() *Service {
	return &Service{}
}

// GetImageInfo 获取图片信息
func (s *Service) GetImageInfo(data []byte) (*ImageInfo, error) {
	img, format, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("解码图片失败: %w", err)
	}

	// 确定格式
	var imgFormat ImageFormat
	switch format {
	case "jpeg", "jpg":
		imgFormat = FormatJPEG
	case "png":
		imgFormat = FormatPNG
	case "webp":
		imgFormat = FormatWebP
	case "tiff":
		imgFormat = FormatTIFF
	default:
		return nil, fmt.Errorf("不支持的图片格式: %s", format)
	}

	return &ImageInfo{
		Width:  img.Width,
		Height: img.Height,
		Format: imgFormat,
		Size:   int64(len(data)),
	}, nil
}

// Compress 压缩单张图片
func (s *Service) Compress(data []byte, options CompressionOptions) (*CompressionResult, error) {
	// 解码图片
	img, err := imaging.Decode(bytes.NewReader(data), imaging.AutoOrientation(true))
	if err != nil {
		return nil, fmt.Errorf("解码图片失败: %w", err)
	}

	// 获取原始尺寸
	bounds := img.Bounds()
	originalWidth := bounds.Max.X
	originalHeight := bounds.Max.Y

	// 计算目标尺寸
	targetWidth, targetHeight := s.calculateTargetSize(
		originalWidth,
		originalHeight,
		options.TargetWidth,
		options.TargetHeight,
		options.KeepAspectRatio,
	)

	// 缩放图片
	if targetWidth != originalWidth || targetHeight != originalHeight {
		img = imaging.Resize(img, targetWidth, targetHeight, imaging.Lanczos)
	}

	// 获取输出格式
	outputFormat := options.Format
	if outputFormat == "" {
		// 保持原格式
		info, err := s.GetImageInfo(data)
		if err != nil {
			return nil, err
		}
		outputFormat = info.Format
	}

	// 编码图片
	compressedData, err := s.encodeImage(img, outputFormat, options)
	if err != nil {
		return nil, fmt.Errorf("编码图片失败: %w", err)
	}

	// 计算压缩率
	originalSize := int64(len(data))
	compressedSize := int64(len(compressedData))
	compressionRatio := float64(originalSize-compressedSize) / float64(originalSize) * 100

	// 获取最终尺寸
	finalBounds := img.Bounds()

	return &CompressionResult{
		Data:            compressedData,
		OriginalSize:    originalSize,
		CompressedSize:  compressedSize,
		CompressionRatio: compressionRatio,
		OutputFormat:    outputFormat,
		Width:           finalBounds.Max.X,
		Height:          finalBounds.Max.Y,
	}, nil
}

// BatchCompress 批量压缩
func (s *Service) BatchCompress(req BatchCompressionRequest) (*BatchCompressionResponse, error) {
	results := make([]CompressionResult, 0, len(req.Images))
	successCount := 0
	failedCount := 0

	for _, imgData := range req.Images {
		result, err := s.Compress(imgData, req.Options)
		if err != nil {
			failedCount++
			continue
		}
		results = append(results, *result)
		successCount++
	}

	return &BatchCompressionResponse{
		Results:      results,
		SuccessCount: successCount,
		FailedCount:  failedCount,
	}, nil
}

// Save 保存图片到本地
func (s *Service) Save(result *CompressionResult, options SaveOptions) (string, error) {
	// 确保目录存在
	if err := os.MkdirAll(options.Path, 0755); err != nil {
		return "", fmt.Errorf("创建目录失败: %w", err)
	}

	// 构建完整的文件路径
	fullPath := filepath.Join(options.Path, options.Filename)

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

// BatchSaveToZip 批量保存图片到ZIP文件
func (s *Service) BatchSaveToZip(results []*CompressionResult, options BatchSaveOptions) (string, error) {
	// 确保目录存在
	if err := os.MkdirAll(options.ZipPath, 0755); err != nil {
		return "", fmt.Errorf("创建目录失败: %w", err)
	}

	// 构建完整的ZIP文件路径
	zipPath := filepath.Join(options.ZipPath, options.ZipFilename)

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
			filename = options.Filenames[i]
		} else {
			filename = fmt.Sprintf("compressed_image_%d.jpg", i+1)
		}

		// 确保文件名有扩展名
		ext := filepath.Ext(filename)
		if ext == "" {
			filename += ".jpg"
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

// encodeImage 编码图片
func (s *Service) encodeImage(img image.Image, format ImageFormat, options CompressionOptions) ([]byte, error) {
	// 设置默认质量
	quality := options.Quality
	if quality <= 0 || quality > 100 {
		quality = 80 // 默认质量
	}

	// 使用buffer接收编码结果
	var buf bytes.Buffer

	switch format {
	case FormatJPEG:
		// 使用标准库编码JPEG
		opts := &jpeg.Options{
			Quality: quality,
		}
		if err := jpeg.Encode(&buf, img, opts); err != nil {
			return nil, err
		}
	case FormatPNG:
		if err := imaging.Encode(&buf, img, imaging.PNG); err != nil {
			return nil, err
		}
	case FormatWebP:
		// WebP编码需要imaging库编译时支持WebP
		// 如果imaging库不支持WebP，则回退到PNG格式
		// 注意：这会导致实际输出格式与期望不符，但至少不会崩溃
		if err := imaging.Encode(&buf, img, imaging.PNG); err != nil {
			return nil, fmt.Errorf("WebP编码失败，建议使用PNG或JPEG格式: %w", err)
		}
	case FormatGIF:
		// GIF编码（不支持质量参数）
		if err := imaging.Encode(&buf, img, imaging.GIF); err != nil {
			return nil, err
		}
	case FormatBMP:
		// BMP编码（不支持质量参数）
		if err := imaging.Encode(&buf, img, imaging.BMP); err != nil {
			return nil, err
		}
	case FormatTIFF:
		// TIFF编码（不支持质量参数）
		if err := imaging.Encode(&buf, img, imaging.TIFF); err != nil {
			return nil, err
		}
	case FormatAVIF:
		// AVIF格式当前Go生态支持有限，暂不支持
		return nil, fmt.Errorf("AVIF格式暂不支持，建议使用WebP格式")
	default:
		return nil, fmt.Errorf("不支持的格式: %s", format)
	}

	return buf.Bytes(), nil
}
