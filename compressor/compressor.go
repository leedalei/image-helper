package compressor

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v3/pkg/application"
)

// Compressor Wails服务结构体
type Compressor struct {
	ctx     context.Context
	service CompressorService
}

// NewCompressor 创建新的Compressor实例
func NewCompressor() *Compressor {
	return &Compressor{
		service: NewService(),
	}
}

// Startup Wails应用启动时调用
func (c *Compressor) Startup(ctx context.Context) {
	c.ctx = ctx
	fmt.Println("Compressor服务已启动")
}

// Shutdown Wails应用关闭时调用
func (c *Compressor) Shutdown(ctx context.Context) {
	fmt.Println("Compressor服务已关闭")
}

// ReadImageFile 读取图片文件并返回base64编码
// 前端调用格式：await compressor.ReadImageFile(filePath)
func (c *Compressor) ReadImageFile(filePath string) (string, error) {
	// 读取文件
	data, err := os.ReadFile(filePath)
	if err != nil {
		return "", fmt.Errorf("读取文件失败: %w", err)
	}

	// 编码为base64
	base64Data := base64.StdEncoding.EncodeToString(data)

	return base64Data, nil
}

// OpenFileDialog 打开文件选择对话框（支持多选）
// 前端调用格式：await compressor.OpenFileDialog()
// 返回文件路径数组，前端需要调用 ReadImageFile 读取内容
func (c *Compressor) OpenFileDialog() ([]string, error) {
	// 使用 Wails v3 的对话框 API
	app := application.Get()
	if app == nil {
		return nil, fmt.Errorf("无法获取应用实例")
	}

	// 设置图片文件过滤器，支持多选
	filePaths, err := app.Dialog.OpenFile().
		SetTitle("选择图片文件").
		SetMessage("请选择要压缩的图片文件（可多选）").
		AddFilter("图片文件", "*.jpg;*.jpeg;*.png;*.webp;*.gif").
		PromptForMultipleSelection()

	if err != nil {
		return nil, fmt.Errorf("打开文件对话框失败: %w", err)
	}

	return filePaths, nil
}

// SaveFileDialog 打开文件保存对话框并保存内容
// 前端调用格式：await compressor.SaveFileDialog(defaultName, content, mimeType)
// 返回保存的文件路径
func (c *Compressor) SaveFileDialog(defaultName, content, mimeType string) (string, error) {
	// 使用 Wails v3 的对话框 API
	app := application.Get()
	if app == nil {
		return "", fmt.Errorf("无法获取应用实例")
	}

	// 构建默认文件名
	if defaultName == "" {
		defaultName = "compressed_image.jpg"
	}

	// 设置保存对话框
	filePath, err := app.Dialog.SaveFile().
		SetMessage("请选择保存位置").
		SetFilename(defaultName).
		AddFilter("JPEG 文件", "*.jpg;*.jpeg").
		AddFilter("PNG 文件", "*.png").
		AddFilter("WebP 文件", "*.webp").
		PromptForSingleSelection()

	if err != nil {
		return "", fmt.Errorf("打开保存对话框失败: %w", err)
	}

	return filePath, nil
}

// SelectDirectoryDialog 打开目录选择对话框
// 前端调用格式：await compressor.SelectDirectoryDialog(defaultPath)
// 返回选择的目录路径
func (c *Compressor) SelectDirectoryDialog(defaultPath string) (string, error) {
	// 使用 Wails v3 的 OpenFileDialog API，通过设置 CanChooseDirectories 来实现文件夹选择
	app := application.Get()
	if app == nil {
		return "", fmt.Errorf("应用实例不可用")
	}

	// 构建文件夹选择对话框配置
	// 通过设置 CanChooseDirectories(true) 和 CanChooseFiles(false) 来实现文件夹选择器
	dialog := app.Dialog.OpenFile().
		SetTitle("选择保存目录").
		SetMessage("请选择要保存图片的目录").
		CanChooseDirectories(true).
		CanChooseFiles(false)

	// 设置默认目录（如果提供）
	if defaultPath != "" {
		dialog = dialog.SetDirectory(defaultPath)
	}

	// 执行目录选择并获取结果
	dirPath, err := dialog.PromptForSingleSelection()
	if err != nil {
		return "", fmt.Errorf("文件夹选择对话框操作失败: %w", err)
	}

	// 验证选择结果
	if dirPath == "" {
		return "", fmt.Errorf("未选择任何目录")
	}

	return dirPath, nil
}

// GetImageInfo 获取图片信息
// 前端调用格式：await compressor.GetImageInfo(imageData)
// 返回base64编码的图片信息和文件大小
func (c *Compressor) GetImageInfo(imageData string) (string, error) {
	// 解码base64数据
	data, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return "", fmt.Errorf("解码图片数据失败: %w", err)
	}

	// 获取图片信息
	info, err := c.service.GetImageInfo(data)
	if err != nil {
		return "", fmt.Errorf("获取图片信息失败: %w", err)
	}

	// 返回JSON格式信息
	result := fmt.Sprintf(`{
		"width": %d,
		"height": %d,
		"format": "%s",
		"size": %d
	}`, info.Width, info.Height, info.Format, info.Size)

	return result, nil
}

// CompressImage 压缩单张图片
// 前端调用格式：await compressor.CompressImage(imageData, options)
// 返回base64编码的压缩结果和统计信息
func (c *Compressor) CompressImage(imageData string, options string) (string, error) {
	// 解码base64数据
	data, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return "", fmt.Errorf("解码图片数据失败: %w", err)
	}

	// 解析压缩选项
	compressionOptions := CompressionOptions{
		Quality:         80,
		Format:          FormatJPEG,
		KeepAspectRatio: true,
		Progressive:     true,
		Optimize:        true,
	}

	if options != "" {
		// 解析JSON选项
		var parsedOptions CompressionOptions
		if err := json.Unmarshal([]byte(options), &parsedOptions); err != nil {
			return "", fmt.Errorf("解析压缩选项失败: %w", err)
		}

		// 使用解析的选项，保留默认值
		if parsedOptions.Quality > 0 {
			compressionOptions.Quality = parsedOptions.Quality
		}
		if parsedOptions.Format != "" {
			compressionOptions.Format = parsedOptions.Format
		}
		if parsedOptions.TargetWidth >= 0 {
			compressionOptions.TargetWidth = parsedOptions.TargetWidth
		}
		if parsedOptions.TargetHeight >= 0 {
			compressionOptions.TargetHeight = parsedOptions.TargetHeight
		}
		compressionOptions.KeepAspectRatio = parsedOptions.KeepAspectRatio
		compressionOptions.Progressive = parsedOptions.Progressive
		compressionOptions.Optimize = parsedOptions.Optimize
	}

	// 执行压缩
	result, err := c.service.Compress(data, compressionOptions)
	if err != nil {
		return "", fmt.Errorf("压缩失败: %w", err)
	}

	// 编码为base64
	compressedData := base64.StdEncoding.EncodeToString(result.Data)

	// 返回JSON格式结果
	jsonResult := fmt.Sprintf(`{
		"imageData": "%s",
		"originalSize": %d,
		"compressedSize": %d,
		"compressionRatio": %.2f,
		"outputFormat": "%s",
		"width": %d,
		"height": %d
	}`,
		compressedData,
		result.OriginalSize,
		result.CompressedSize,
		result.CompressionRatio,
		result.OutputFormat,
		result.Width,
		result.Height,
	)

	return jsonResult, nil
}

// BatchCompress 批量压缩图片
// 前端调用格式：await compressor.BatchCompress(imageDataList, options)
func (c *Compressor) BatchCompress(imageDataList []string, options string) (string, error) {
	// 解析图片数据
	images := make([][]byte, 0, len(imageDataList))
	for _, data := range imageDataList {
		decoded, err := base64.StdEncoding.DecodeString(data)
		if err != nil {
			return "", fmt.Errorf("解码图片数据失败: %w", err)
		}
		images = append(images, decoded)
	}

	// 使用默认选项
	compressionOptions := CompressionOptions{
		Quality:         80,
		Format:          FormatJPEG,
		KeepAspectRatio: true,
		Progressive:     true,
		Optimize:        true,
	}

	// 执行批量压缩
	req := BatchCompressionRequest{
		Images:  images,
		Options: compressionOptions,
	}
	resp, err := c.service.BatchCompress(req)
	if err != nil {
		return "", fmt.Errorf("批量压缩失败: %w", err)
	}

	// 编码结果
	results := make([]string, 0, len(resp.Results))
	for _, result := range resp.Results {
		compressedData := base64.StdEncoding.EncodeToString(result.Data)
		results = append(results, compressedData)
	}

	return fmt.Sprintf(`{
		"results": %d,
		"successCount": %d,
		"failedCount": %d
	}`, len(results), resp.SuccessCount, resp.FailedCount), nil
}

// SaveImage 保存图片到本地
// 前端调用格式：await compressor.SaveImage(imageData, path, filename)
func (c *Compressor) SaveImage(imageData string, path string, filename string, overwrite bool) (string, error) {
	// 解码base64数据
	data, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return "", fmt.Errorf("解码图片数据失败: %w", err)
	}

	// 压缩数据
	result := &CompressionResult{
		Data: data,
	}

	// 保存选项
	saveOptions := SaveOptions{
		Path:      path,
		Filename:  filename,
		Overwrite: overwrite,
	}

	// 执行保存
	savedPath, err := c.service.Save(result, saveOptions)
	if err != nil {
		return "", fmt.Errorf("保存失败: %w", err)
	}

	return savedPath, nil
}

// BatchSaveToZip 批量保存图片到ZIP文件
// 前端调用格式：await compressor.BatchSaveToZip(imageDataList, zipPath, zipFilename, filenames)
func (c *Compressor) BatchSaveToZip(imageDataList []string, zipPath string, zipFilename string, filenames string) (string, error) {
	// 解析图片数据
	images := make([]*CompressionResult, 0, len(imageDataList))
	for _, data := range imageDataList {
		decoded, err := base64.StdEncoding.DecodeString(data)
		if err != nil {
			return "", fmt.Errorf("解码图片数据失败: %w", err)
		}
		images = append(images, &CompressionResult{
			Data: decoded,
		})
	}

	// 解析文件名列表
	var filenameList []string
	if filenames != "" {
		if err := json.Unmarshal([]byte(filenames), &filenameList); err != nil {
			return "", fmt.Errorf("解析文件名列表失败: %w", err)
		}
	}

	// 构建保存选项
	saveOptions := BatchSaveOptions{
		ZipPath:     zipPath,
		ZipFilename: zipFilename,
		Filenames:   filenameList,
	}

	// 执行批量保存
	savedPath, err := c.service.BatchSaveToZip(images, saveOptions)
	if err != nil {
		return "", fmt.Errorf("批量保存到ZIP失败: %w", err)
	}

	return savedPath, nil
}
