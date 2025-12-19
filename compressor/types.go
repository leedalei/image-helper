package compressor

// ImageFormat 图片格式
type ImageFormat string

const (
	FormatJPEG ImageFormat = "jpeg"
	FormatPNG  ImageFormat = "png"
	FormatWebP ImageFormat = "webp"
	FormatTIFF ImageFormat = "tiff"
	FormatGIF  ImageFormat = "gif"
	FormatBMP  ImageFormat = "bmp"
	FormatAVIF ImageFormat = "avif"
)

// CompressionOptions 压缩配置选项
type CompressionOptions struct {
	// 质量 (1-100)
	Quality int `json:"quality"`

	// 目标格式
	Format ImageFormat `json:"format"`

	// 目标宽度 (0表示不限制)
	TargetWidth int `json:"targetWidth"`

	// 目标高度 (0表示不限制)
	TargetHeight int `json:"targetHeight"`

	// 是否保持宽高比
	KeepAspectRatio bool `json:"keepAspectRatio"`

	// 是否渐进式编码 (仅JPEG)
	Progressive bool `json:"progressive"`

	// 优化编码
	Optimize bool `json:"optimize"`
}

// CompressionResult 压缩结果
type CompressionResult struct {
	// 压缩后的图片数据
	Data []byte `json:"-"`

	// 原始大小
	OriginalSize int64 `json:"originalSize"`

	// 压缩后大小
	CompressedSize int64 `json:"compressedSize"`

	// 压缩率 (0-100)
	CompressionRatio float64 `json:"compressionRatio"`

	// 输出格式
	OutputFormat ImageFormat `json:"outputFormat"`

	// 图片尺寸
	Width  int `json:"width"`
	Height int `json:"height"`

	// 保存路径 (如果保存到本地)
	SavePath string `json:"savePath,omitempty"`
}

// ImageInfo 图片信息
type ImageInfo struct {
	// 宽度
	Width int `json:"width"`

	// 高度
	Height int `json:"height"`

	// 格式
	Format ImageFormat `json:"format"`

	// 文件大小
	Size int64 `json:"size"`
}

// SaveOptions 保存选项
type SaveOptions struct {
	// 保存路径
	Path string `json:"path"`

	// 文件名 (不包含扩展名)
	Filename string `json:"filename"`

	// 是否覆盖已存在文件
	Overwrite bool `json:"overwrite"`
}

// BatchCompressionRequest 批量压缩请求
type BatchCompressionRequest struct {
	// 图片数据列表
	Images [][]byte `json:"images"`

	// 压缩配置
	Options CompressionOptions `json:"options"`
}

// BatchCompressionResponse 批量压缩响应
type BatchCompressionResponse struct {
	// 压缩结果列表
	Results []CompressionResult `json:"results"`

	// 成功数量
	SuccessCount int `json:"successCount"`

	// 失败数量
	FailedCount int `json:"failedCount"`
}

// CompressorService 图片压缩服务接口
type CompressorService interface {
	// 获取图片信息
	GetImageInfo(data []byte) (*ImageInfo, error)

	// 压缩单张图片
	Compress(data []byte, options CompressionOptions) (*CompressionResult, error)

	// 批量压缩
	BatchCompress(req BatchCompressionRequest) (*BatchCompressionResponse, error)

	// 保存图片到本地
	Save(result *CompressionResult, options SaveOptions) (string, error)

	// 批量保存到ZIP文件
	BatchSaveToZip(results []*CompressionResult, options BatchSaveOptions) (string, error)
}

// BatchSaveOptions 批量保存到ZIP的选项
type BatchSaveOptions struct {
	// ZIP文件保存路径
	ZipPath string `json:"zipPath"`

	// ZIP文件名
	ZipFilename string `json:"zipFilename"`

	// 文件名列表（可选）
	Filenames []string `json:"filenames,omitempty"`
}
