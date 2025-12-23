package editor

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v3/pkg/application"
)

// Editor Wails服务结构体
type Editor struct {
	ctx     context.Context
	service ImageEditorService
}

// NewEditor 创建新的Editor实例
func NewEditor() *Editor {
	return &Editor{
		service: NewService(),
	}
}

// Startup Wails应用启动时调用
func (e *Editor) Startup(ctx context.Context) {
	e.ctx = ctx
	fmt.Println("Editor服务已启动")
}

// Shutdown Wails应用关闭时调用
func (e *Editor) Shutdown(ctx context.Context) {
	fmt.Println("Editor服务已关闭")
}

// ReadImageFile 读取图片文件并返回base64编码
// 前端调用格式：await editor.ReadImageFile(filePath)
func (e *Editor) ReadImageFile(filePath string) (string, error) {
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
// 前端调用格式：await editor.OpenFileDialog()
// 返回文件路径数组，前端需要调用 ReadImageFile 读取内容
func (e *Editor) OpenFileDialog() ([]string, error) {
	// 使用 Wails v3 的对话框 API
	app := application.Get()
	if app == nil {
		return nil, fmt.Errorf("无法获取应用实例")
	}

	// 设置图片文件过滤器，支持多选
	filePaths, err := app.Dialog.OpenFile().
		SetTitle("选择图片文件").
		SetMessage("请选择要编辑的图片文件（可多选）").
		AddFilter("图片文件", "*.jpg;*.jpeg;*.png;*.webp;*.gif;*.bmp;*.tiff").
		PromptForMultipleSelection()

	if err != nil {
		return nil, fmt.Errorf("打开文件对话框失败: %w", err)
	}

	return filePaths, nil
}

// SelectDirectoryDialog 打开目录选择对话框
// 前端调用格式：await editor.SelectDirectoryDialog(defaultPath)
// 返回选择的目录路径
func (e *Editor) SelectDirectoryDialog(defaultPath string) (string, error) {
	app := application.Get()
	if app == nil {
		return "", fmt.Errorf("应用实例不可用")
	}

	dialog := app.Dialog.OpenFile().
		SetTitle("选择保存目录").
		SetMessage("请选择要保存图片的目录").
		CanChooseDirectories(true).
		CanChooseFiles(false)

	if defaultPath != "" {
		dialog = dialog.SetDirectory(defaultPath)
	}

	dirPath, err := dialog.PromptForSingleSelection()
	if err != nil {
		return "", fmt.Errorf("文件夹选择对话框操作失败: %w", err)
	}

	if dirPath == "" {
		return "", fmt.Errorf("未选择任何目录")
	}

	return dirPath, nil
}

// SaveFileDialog 打开文件保存对话框
// 前端调用格式：await editor.SaveFileDialog(defaultName, content, mimeType)
// 返回保存的文件路径
func (e *Editor) SaveFileDialog(defaultName, content, mimeType string) (string, error) {
	app := application.Get()
	if app == nil {
		return "", fmt.Errorf("无法获取应用实例")
	}

	if defaultName == "" {
		defaultName = "edited_image.png"
	}

	filePath, err := app.Dialog.SaveFile().
		SetMessage("请选择保存位置").
		SetFilename(defaultName).
		AddFilter("PNG 文件", "*.png").
		AddFilter("JPEG 文件", "*.jpg;*.jpeg").
		AddFilter("WebP 文件", "*.webp").
		PromptForSingleSelection()

	if err != nil {
		return "", fmt.Errorf("打开保存对话框失败: %w", err)
	}

	return filePath, nil
}

// EditImage 编辑单张图片
// 前端调用格式：await editor.EditImage(imageData, options)
// 返回base64编码的编辑结果和统计信息
func (e *Editor) EditImage(imageData string, options string) (string, error) {
	// 解码base64数据
	data, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return "", fmt.Errorf("解码图片数据失败: %w", err)
	}

	// 解析编辑选项
	var editOptions EditOptions
	if options != "" {
		if err := json.Unmarshal([]byte(options), &editOptions); err != nil {
			return "", fmt.Errorf("解析编辑选项失败: %w", err)
		}
	}

	// 执行编辑
	result, err := e.service.(*Service).processImage(data, editOptions)
	if err != nil {
		return "", fmt.Errorf("编辑失败: %w", err)
	}

	// 编码为base64
	editedData := base64.StdEncoding.EncodeToString(result.Data)

	// 返回JSON格式结果
	operationsJSON, _ := json.Marshal(result.Operations)
	jsonResult := fmt.Sprintf(`{
		"imageData": "%s",
		"width": %d,
		"height": %d,
		"format": "%s",
		"operations": %s
	}`,
		editedData,
		result.Width,
		result.Height,
		result.Format,
		string(operationsJSON),
	)

	return jsonResult, nil
}

// BatchEdit 批量编辑图片
// 前端调用格式：await editor.BatchEdit(imageDataList, options)
func (e *Editor) BatchEdit(imageDataList []string, options string) (string, error) {
	// 解析图片数据
	images := make([][]byte, 0, len(imageDataList))
	for _, data := range imageDataList {
		decoded, err := base64.StdEncoding.DecodeString(data)
		if err != nil {
			return "", fmt.Errorf("解码图片数据失败: %w", err)
		}
		images = append(images, decoded)
	}

	// 解析编辑选项
	var editOptions EditOptions
	if options != "" {
		if err := json.Unmarshal([]byte(options), &editOptions); err != nil {
			return "", fmt.Errorf("解析编辑选项失败: %w", err)
		}
	}

	// 执行批量编辑
	req := BatchEditRequest{
		Images:  images,
		Options: editOptions,
	}
	resp, err := e.service.BatchEdit(req)
	if err != nil {
		return "", fmt.Errorf("批量编辑失败: %w", err)
	}

	// 编码结果
	results := make([]string, 0, len(resp.Results))
	for _, result := range resp.Results {
		editedData := base64.StdEncoding.EncodeToString(result.Data)
		results = append(results, editedData)
	}

	resultsJSON, _ := json.Marshal(results)
	return fmt.Sprintf(`{
		"results": %s,
		"successCount": %d,
		"failedCount": %d
	}`, string(resultsJSON), resp.SuccessCount, resp.FailedCount), nil
}

// SaveImage 保存图片到本地
// 前端调用格式：await editor.SaveImage(imageData, path, filename, overwrite)
func (e *Editor) SaveImage(imageData string, path string, filename string, overwrite bool) (string, error) {
	// 解码base64数据
	data, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return "", fmt.Errorf("解码图片数据失败: %w", err)
	}

	// 编辑结果
	result := &EditResult{
		Data:   data,
		Format: FormatPNG,
	}

	// 保存选项
	saveOptions := SaveOptions{
		Path:      path,
		Filename:  filename,
		Overwrite: overwrite,
	}

	// 执行保存
	savedPath, err := e.service.Save(result, saveOptions)
	if err != nil {
		return "", fmt.Errorf("保存失败: %w", err)
	}

	return savedPath, nil
}

// BatchSaveToZip 批量保存图片到ZIP文件
// 前端调用格式：await editor.BatchSaveToZip(imageDataList, zipPath, zipFilename, filenames)
func (e *Editor) BatchSaveToZip(imageDataList []string, zipPath string, zipFilename string, filenames string) (string, error) {
	// 解析图片数据
	images := make([]*EditResult, 0, len(imageDataList))
	for _, data := range imageDataList {
		decoded, err := base64.StdEncoding.DecodeString(data)
		if err != nil {
			return "", fmt.Errorf("解码图片数据失败: %w", err)
		}
		images = append(images, &EditResult{
			Data:   decoded,
			Format: FormatPNG,
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
	savedPath, err := e.service.BatchSaveToZip(images, saveOptions)
	if err != nil {
		return "", fmt.Errorf("批量保存到ZIP失败: %w", err)
	}

	return savedPath, nil
}
