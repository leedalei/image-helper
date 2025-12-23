package editor

// WatermarkPosition 水印位置
type WatermarkPosition string

const (
	PositionTopLeft     WatermarkPosition = "top-left"
	PositionTopRight    WatermarkPosition = "top-right"
	PositionBottomLeft  WatermarkPosition = "bottom-left"
	PositionBottomRight WatermarkPosition = "bottom-right"
	PositionCenter      WatermarkPosition = "center"
	PositionTile        WatermarkPosition = "tile"
)

// WatermarkDensity 水印密度
type WatermarkDensity string

const (
	DensitySparse WatermarkDensity = "sparse"
	DensityMedium WatermarkDensity = "medium"
	DensityDense  WatermarkDensity = "dense"
)

// ImageFormat 图片格式
type ImageFormat string

const (
	FormatJPEG ImageFormat = "jpeg"
	FormatPNG  ImageFormat = "png"
	FormatWebP ImageFormat = "webp"
	FormatTIFF ImageFormat = "tiff"
	FormatGIF  ImageFormat = "gif"
	FormatBMP  ImageFormat = "bmp"
)

// WatermarkOptions 水印选项
type WatermarkOptions struct {
	Opacity  float64           `json:"opacity"`  // 透明度 (0-1)
	Position WatermarkPosition `json:"position"` // 位置
	Density  WatermarkDensity  `json:"density"`  // 密度（仅平铺时）
}

// TextWatermarkOptions 文本水印选项
type TextWatermarkOptions struct {
	WatermarkOptions
	Text      string `json:"text"`      // 文本内容
	FontSize  int    `json:"fontSize"`  // 字体大小
	FontColor string `json:"fontColor"` // 字体颜色
	FontStyle string `json:"fontStyle"` // 字体样式
}

// ResizeOptions 尺寸调整选项
type ResizeOptions struct {
	Width           int  `json:"width"`           // 目标宽度
	Height          int  `json:"height"`          // 目标高度
	KeepAspectRatio bool `json:"keepAspectRatio"` // 保持宽高比
}

// RotateOptions 旋转选项
type RotateOptions struct {
	Angle int `json:"angle"` // 旋转角度
}

// EditOptions 编辑选项
type EditOptions struct {
	Resize         *ResizeOptions        `json:"resize,omitempty"`
	Rotate         *RotateOptions        `json:"rotate,omitempty"`
	Watermark      *WatermarkOptions     `json:"watermark,omitempty"`
	WatermarkImage []byte                `json:"-"` // 水印图片数据
	TextWater      *TextWatermarkOptions `json:"textWatermark,omitempty"`
}

// EditResult 编辑结果
type EditResult struct {
	Data       []byte      `json:"-"`          // 编辑后的数据
	Width      int         `json:"width"`      // 宽度
	Height     int         `json:"height"`     // 高度
	Format     ImageFormat `json:"format"`     // 格式
	Operations []string    `json:"operations"` // 应用的操作列表
}

// BatchEditRequest 批量编辑请求
type BatchEditRequest struct {
	Images  [][]byte    `json:"images"`  // 图片数据列表
	Options EditOptions `json:"options"` // 编辑选项
}

// BatchEditResponse 批量编辑响应
type BatchEditResponse struct {
	Results      []EditResult `json:"results"`      // 编辑结果列表
	SuccessCount int          `json:"successCount"` // 成功数量
	FailedCount  int          `json:"failedCount"`  // 失败数量
}

// SaveOptions 保存选项
type SaveOptions struct {
	Path      string `json:"path"`      // 保存路径
	Filename  string `json:"filename"`  // 文件名
	Overwrite bool   `json:"overwrite"` // 是否覆盖
}

// BatchSaveOptions 批量保存选项
type BatchSaveOptions struct {
	ZipPath     string   `json:"zipPath"`              // ZIP文件保存路径
	ZipFilename string   `json:"zipFilename"`          // ZIP文件名
	Filenames   []string `json:"filenames,omitempty"`  // 文件名列表
}

// ImageEditorService 图片编辑服务接口
type ImageEditorService interface {
	// 调整图片尺寸
	Resize(data []byte, width, height int, keepAspectRatio bool) ([]byte, error)

	// 添加图片水印
	AddImageWatermark(data []byte, watermark []byte, options WatermarkOptions) ([]byte, error)

	// 添加文本水印
	AddTextWatermark(data []byte, text string, options TextWatermarkOptions) ([]byte, error)

	// 旋转图片
	Rotate(data []byte, angle int) ([]byte, error)

	// 批量编辑
	BatchEdit(req BatchEditRequest) (*BatchEditResponse, error)

	// 保存编辑结果
	Save(result *EditResult, options SaveOptions) (string, error)

	// 批量保存到ZIP
	BatchSaveToZip(results []*EditResult, options BatchSaveOptions) (string, error)
}
