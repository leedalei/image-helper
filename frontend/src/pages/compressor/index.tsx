import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ButtonGroup } from '../../components/ui/button-group';
import { Progress } from '../../components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import Uploader from '../../components/Uploader';
import ImageComparison from '../../components/ImageComparison';
import CompressorSettings from '../../components/CompressorSettings';
import { Compressor } from '../../../bindings/changeme/compressor';
import { Plus, X, Ellipsis, ArrowRight, Download, Play, ZoomIn, ZoomOut, RotateCcwSquare, RotateCwSquare, Bolt } from 'lucide-react';
import { toast } from 'sonner';
import { base64ToBlob, fileToBase64, formatFileSize, getMimeTypeFromExtension } from '@/lib/utils';
const { CompressImage, BatchCompress, BatchSaveToZip, SaveImage, SaveFileDialog, ReadImageFile, OpenFileDialog, SelectDirectoryDialog } = Compressor;

interface ImageFile {
  file: File;
  originalImageData: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

// 用于对比预览的即时压缩文件对象
interface PreviewData {
  imageData: string;
  blob: Blob;
  stats: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    width: number;
    height: number;
    outputFormat: string;
  };
}

interface ImageTransform {
  scale: number;
  rotation: number;
}

function ImageCompressor() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCompressionStarted, setIsCompressionStarted] = useState(false);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    rotation: 0,
  });
  // 压缩设置对象 - 统一管理所有设置
  const [settings, setSettings] = useState({
    quality: 80,
    format: 'original' as string,
    targetWidth: 0,
    targetHeight: 0,
    keepAspectRatio: true,
    progressive: true,
    optimize: true,
    batchSavePath: '', // 批量保存路径
  });

  // 当前预览对象 - 保存用于对比预览的即时压缩文件对象
  const [currentPreview, setCurrentPreview] = useState<PreviewData | null>(null);

  // 使用 ref 保存最新状态，避免闭包问题
  const imageFilesRef = useRef(imageFiles);
  const selectedIndexRef = useRef(selectedIndex);

  // 同步 ref 和状态
  useEffect(() => {
    imageFilesRef.current = imageFiles;
  }, [imageFiles]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const currentFile = imageFiles[selectedIndex] || null;

  const originalImageUrl = useMemo(() => {
    if (!currentFile?.file) return null;
    return URL.createObjectURL(currentFile.file);
  }, [currentFile?.file]);

  const compressedImageUrl = useMemo(() => {
    // 显示当前预览数据
    if (currentPreview?.blob) {
      return URL.createObjectURL(currentPreview.blob);
    }
    return null;
  }, [currentPreview?.blob]);

  // 预览压缩图片（不更新status）
  const previewImageWithBackend = async (
    base64Data: string,
    file: File
  ) => {
    try {
      let targetFormat = settings.format;
      if (settings.format === 'original') {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension === 'jpg' || extension === 'jpeg') {
          targetFormat = 'jpeg';
        } else if (extension === 'png') {
          targetFormat = 'png';
        } else if (extension === 'webp') {
          targetFormat = 'webp';
        } else if (extension === 'gif') {
          targetFormat = 'gif';
        } else if (extension === 'bmp') {
          targetFormat = 'bmp';
        } else if (extension === 'tiff') {
          targetFormat = 'tiff';
        } else {
          targetFormat = 'jpeg';
        }
      }

      const options = JSON.stringify({
        quality: settings.quality,
        format: targetFormat,
        targetWidth: settings.targetWidth,
        targetHeight: settings.targetHeight,
        keepAspectRatio: settings.keepAspectRatio,
        progressive: settings.progressive,
        optimize: settings.optimize,
      });

      const result = await CompressImage(base64Data, options);
      const parsed = JSON.parse(result);

      const mimeType = `image/${parsed.outputFormat}`;
      const blob = base64ToBlob(parsed.imageData, mimeType);

      // 更新当前预览对象
      setCurrentPreview({
        imageData: parsed.imageData,
        blob: blob,
        stats: {
          originalSize: parsed.originalSize,
          compressedSize: parsed.compressedSize,
          compressionRatio: parsed.compressionRatio,
          width: parsed.width,
          height: parsed.height,
          outputFormat: parsed.outputFormat,
        },
      });
    } catch (error) {
      console.error('预览压缩失败:', error);
    }
  };

  // 使用Go后端压缩图片（更新status）
  const compressImageWithBackend = async (
    base64Data: string,
    file: File,
    index: number
  ) => {
    try {
      // 更新状态为处理中
      setImageFiles(prev => prev.map((img, i) =>
        i === index ? { ...img, status: 'processing' as const } : img
      ));

      let targetFormat = settings.format;
      if (settings.format === 'original') {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension === 'jpg' || extension === 'jpeg') {
          targetFormat = 'jpeg';
        } else if (extension === 'png') {
          targetFormat = 'png';
        } else if (extension === 'webp') {
          targetFormat = 'webp';
        } else {
          targetFormat = 'jpeg';
        }
      }

      const options = JSON.stringify({
        quality: settings.quality,
        format: targetFormat,
        targetWidth: settings.targetWidth,
        targetHeight: settings.targetHeight,
        keepAspectRatio: settings.keepAspectRatio,
        progressive: settings.progressive,
        optimize: settings.optimize,
      });

      const result = await CompressImage(base64Data, options);
      const parsed = JSON.parse(result);

      const mimeType = `image/${parsed.outputFormat}`;
      const blob = base64ToBlob(parsed.imageData, mimeType);

      // 更新图片文件状态
      setImageFiles(prev => prev.map((img, i) =>
        i === index ? {
          ...img,
          originalImageData: base64Data,
          status: 'completed' as const
        } : img
      ));

      // 更新当前预览对象
      setCurrentPreview({
        imageData: parsed.imageData,
        blob: blob,
        stats: {
          originalSize: parsed.originalSize,
          compressedSize: parsed.compressedSize,
          compressionRatio: parsed.compressionRatio,
          width: parsed.width,
          height: parsed.height,
          outputFormat: parsed.outputFormat,
        },
      });
    } catch (error) {
      console.error('压缩失败:', error);
      setImageFiles(prev => prev.map((img, i) =>
        i === index ? { ...img, status: 'error' as const } : img
      ));
    }
  };

  // 处理文件选择
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setSelectedFiles(null);
      setImageFiles([]);
      setIsCompressionStarted(false);
      return;
    }

    setSelectedFiles(files);
    const newImageFiles: ImageFile[] = Array.from(files).map(file => ({
      file,
      originalImageData: null,
      status: 'pending' as const
    }));

    // 设置默认批量保存路径为第一张图片所在目录
    if (files.length > 0) {
      const firstFile = files[0];
      // 尝试从 webkitRelativePath 获取目录，如果不存在则使用文件对象的方法
      let defaultPath = '';
      if (firstFile.webkitRelativePath) {
        defaultPath = firstFile.webkitRelativePath.substring(0, firstFile.webkitRelativePath.lastIndexOf('/'));
      } else {
        // 对于直接选择的文件，我们无法获取完整路径，所以留空由用户选择
        defaultPath = '';
      }
      if (defaultPath) {
        setSettings(prev => ({ ...prev, batchSavePath: defaultPath }));
      } else {
        // 如果无法获取路径，提示用户配置
        toast.info('请在设置中配置保存目录');
      }
    }

    setImageFiles(newImageFiles);
    // 立即选中第一张图片并预览
    setSelectedIndex(0);
    const firstImage = newImageFiles[0];
    if (firstImage) {
      fileToBase64(firstImage.file)
        .then(base64Data => previewImageWithBackend(base64Data, firstImage.file))
        .catch(error => {
          console.error('读取文件失败:', error);
        });
    }
    setIsCompressionStarted(false); // 重置压缩状态
  };

  // 添加更多图片
  const handleAddMoreImages = async () => {
    try {
      // 使用后端对话框选择文件（多选）
      const filePaths = await OpenFileDialog();
      if (!filePaths || (Array.isArray(filePaths) && filePaths.length === 0)) {
        return;
      }

      // 如果返回的是单个路径，转换为数组
      const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

      try {
        // 读取所有选择的文件
        const files: File[] = [];
        for (const filePath of paths) {
          try {
            const base64Data = await ReadImageFile(filePath);
            const fileName = filePath.split('/').pop() || 'image.jpg';

            // 尝试从文件扩展名判断 MIME 类型
            const extension = fileName.split('.').pop()?.toLowerCase();
            const mimeType = getMimeTypeFromExtension(extension || '');

            // 将 base64 转换为 Blob
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });

            // 创建 File 对象
            const file = new File([blob], fileName, { type: mimeType });
            files.push(file);
          } catch (error) {
            console.error(`读取文件失败: ${filePath}`, error);
          }
        }

        // 创建 FileList 对象
        if (files.length > 0) {
          const dt = new DataTransfer();
          // 添加现有文件
          imageFiles.forEach(img => dt.items.add(img.file));
          // 添加新文件
          files.forEach(file => dt.items.add(file));

          // 更新 imageFiles
          const newImageFiles: ImageFile[] = files.map(file => ({
            file,
            originalImageData: null,
            status: 'pending' as const
          }));

          const wasEmpty = imageFiles.length === 0;
          setImageFiles(prev => [...prev, ...newImageFiles]);
          setSelectedFiles(dt.files);

          // 如果原来没有图片，则选中并压缩第一张新添加的图片
          if (wasEmpty) {
            setSelectedIndex(0);
            const firstNewImage = newImageFiles[0];
            if (firstNewImage) {
              fileToBase64(firstNewImage.file)
                .then(base64Data => compressImageWithBackend(base64Data, firstNewImage.file, 0))
                .catch(error => {
                  console.error('读取文件失败:', error);
                  setImageFiles(prev => prev.map((img, i) =>
                    i === 0 ? { ...img, status: 'error' as const } : img
                  ));
                });
            }
          }
        }
      } catch (error) {
        console.error('读取文件失败:', error);
        alert('读取文件失败，请重试');
      }
    } catch (error) {
      console.error('文件选择失败:', error);
      alert('文件选择失败，请重试');
    }
  };

  // 应用设置变更
  const applySettings = (newSettings: typeof settings) => {
    // 对比新旧设置，检测是否有变更
    const hasChanges = JSON.stringify(newSettings) !== JSON.stringify(settings);

    setSettings(newSettings);

    if (hasChanges) {
      // 如果设置有变更，重置所有图片的status和当前预览
      setImageFiles(prev => prev.map(img => ({
        ...img,
        status: 'pending' as const,
      })));
      setCurrentPreview(null);
      setIsCompressionStarted(false);

      // 重新预览当前选中的图片（使用 ref 获取最新状态）
      const currentImage = imageFilesRef.current[selectedIndexRef.current];
      if (currentImage) {
        fileToBase64(currentImage.file)
          .then(base64Data => previewImageWithBackend(base64Data, currentImage.file))
          .catch(error => {
            console.error('读取文件失败:', error);
          });
      }

      toast.success('设置已更新，图片需要重新压缩');
    } else {
      toast.success('设置已更新');
    }
  };

  // 重置设置
  const resetSettings = () => {
    setSettings(prev => ({
      ...prev,
      quality: 80,
      format: 'original',
      targetWidth: 0,
      targetHeight: 0,
      keepAspectRatio: true,
      progressive: true,
      optimize: true,
      batchSavePath: prev.batchSavePath, // 保留批量保存路径
    }));
    toast.success('设置已重置');
  };

  // 更改批量保存路径
  const handleChangeSavePath = async (currentPath: string) => {
    try {
      // 使用文件对话框让用户选择一个目录（通过选择文件获取目录）
      const selectedPath = await SelectDirectoryDialog(currentPath);
      if (selectedPath) {
        setSettings(prev => ({ ...prev, batchSavePath: selectedPath }));
        toast.success('保存路径已更新');
      }
    } catch (error) {
      console.error('选择保存路径失败:', error);
      toast.error('选择保存路径失败，请重试');
    }
  };

  // 开始压缩所有文件（使用批量压缩接口）
  const handleStartCompression = async () => {
    if (imageFiles.length === 0) return;

    // 检查是否配置了保存目录
    if (!settings.batchSavePath) {
      toast.error('请先在设置中配置保存目录');
      setIsSettingsOpen(true);
      return;
    }

    setIsCompressionStarted(true);
    setImageFiles(prev => prev.map(img => ({ ...img, status: 'processing' as const })));

    try {
      // 准备压缩选项
      let targetFormat = settings.format;
      if (settings.format === 'original') {
        targetFormat = 'jpeg'; // 默认格式
      }

      const options = JSON.stringify({
        quality: settings.quality,
        format: targetFormat,
        targetWidth: settings.targetWidth,
        targetHeight: settings.targetHeight,
        keepAspectRatio: settings.keepAspectRatio,
        progressive: settings.progressive,
        optimize: settings.optimize,
      });

      // 将所有图片转换为base64数据
      const base64DataList: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const base64Data = await fileToBase64(imageFiles[i].file);
        base64DataList.push(base64Data);
      }

      // 调用批量压缩接口
      const result = await BatchCompress(base64DataList, options);
      const parsed = JSON.parse(result);

      // 更新所有图片状态和原始数据
      const updatedImageFiles = imageFiles.map((img, index) => ({
        ...img,
        originalImageData: base64DataList[index],
        status: 'completed' as const
      }));
      setImageFiles(updatedImageFiles);

      // 自动保存到ZIP文件
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-');
      const zipFilename = `compressed_images_${timestamp}.zip`;

      // 准备文件名列表
      const filenames = imageFiles.map((img, index) => {
        const baseName = img.file.name.split('.')[0];
        const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
        return `${baseName}_compressed.${extension}`;
      });

      // 调用批量保存到ZIP接口
      const zipResult = await BatchSaveToZip(
        base64DataList,
        settings.batchSavePath,
        zipFilename,
        JSON.stringify(filenames)
      );

      toast.success(`批量压缩完成！成功: ${parsed.successCount}, 失败: ${parsed.failedCount}`);
      toast.success(`ZIP文件已保存到: ${zipResult}`);
    } catch (error) {
      console.error('批量压缩失败:', error);
      setImageFiles(prev => prev.map(img => ({ ...img, status: 'error' as const })));
      toast.error('批量压缩失败，请重试');
    }
  };

  // 删除图片
  const handleRemoveImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);

    // 如果删除的是当前选中的图片，调整选中索引
    if (selectedIndex >= newImageFiles.length) {
      setSelectedIndex(Math.max(0, newImageFiles.length - 1));
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }

    // 如果没有图片了，清空选择
    if (newImageFiles.length === 0) {
      setSelectedFiles(null);
    } else {
      // 更新 selectedFiles
      const dt = new DataTransfer();
      newImageFiles.forEach(img => dt.items.add(img.file));
      setSelectedFiles(dt.files);
    }
  };

  // 选中图片时进行预览压缩（不更新status）
  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
    const imageFile = imageFiles[index];

    // 清除之前的预览数据
    setCurrentPreview(null);

    // 如果已有压缩后的数据，直接使用；否则读取文件
    const processPreview = (base64Data: string) => {
      previewImageWithBackend(base64Data, imageFile.file);
    };

    if (imageFile.originalImageData) {
      // 使用已存储的base64数据
      processPreview(imageFile.originalImageData);
    } else {
      // 读取文件进行预览压缩
      fileToBase64(imageFile.file)
        .then(processPreview)
        .catch(error => {
          console.error('读取文件失败:', error);
        });
    }
  };

  // 图像变换处理函数
  const handleZoomIn = () => {
    setImageTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.1, 3),
    }));
  };

  const handleZoomOut = () => {
    setImageTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.1, 0.5),
    }));
  };

  const handleRotate = (isClockwise: boolean) => {
    setImageTransform(prev => ({
      ...prev,
      rotation: isClockwise
        ? (prev.rotation + 90) % 360
        : (prev.rotation - 90 + 360) % 360,
    }));
  };

  // 计算压缩进度
  const completedCount = imageFiles.filter(img => img.status === 'completed').length;
  const totalCount = imageFiles.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // 保存当前选中的图片
  const handleSaveCurrent = async () => {
    if (!currentFile || !currentPreview) {
      toast.error('没有可保存的压缩数据');
      return;
    }

    try {
      const baseName = currentFile.file.name.split('.')[0];
      const extension = settings.format === 'original'
        ? currentFile.file.name.split('.').pop()
        : settings.format;
      const filename = `${baseName}_compressed.${extension}`;

      // 使用保存对话框选择保存位置
      const filePath = await SaveFileDialog(filename, currentPreview.imageData, 'image/jpeg');
      if (!filePath) return;

      const result = await SaveImage(
        currentPreview.imageData,
        filePath.substring(0, filePath.lastIndexOf('/')),
        filePath.substring(filePath.lastIndexOf('/') + 1),
        true
      );

      console.log('保存成功:', result);
      toast.success(`图片已保存到: ${result}`);
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败，请重试');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!currentFile ? (
        // 文件选择器
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mx-auto mb-4">
            <h1 className="text-3xl font-bold text-center">大雷图片压缩器，压他妈的！</h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>选择图片</CardTitle>
              </CardHeader>
              <CardContent>
                <Uploader
                  onFileSelect={handleFilesSelected}
                  accept="image/*"
                  selectedFiles={selectedFiles}
                  multiple
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // 主界面
        <div className="flex-1 flex flex-col min-w-0">
          {/* 文件信息栏 - 左右布局 */}
          <Card className="m-4">
            <CardContent>
              <div className="flex flex-col gap-2 min-w-0">
                {/* 上方：设置、图片列表和进度条、操作、文件信息 */}
                <div className="flex-1 gap-3 flex min-w-0">
                  {/* 保存操作 - 固定宽度 */}
                  <div className="w-[450px] shrink-0">
                    {/* 当前图片信息 */}
                    <p className="font-medium text-gray-900 truncate break-words">{currentFile.file.name}</p>
                    <p className="flex-wrap text-sm text-gray-500 flex items-center gap-1">
                      <span>文件大小: {formatFileSize(currentFile.file.size)} </span>
                      {currentPreview?.stats &&
                        <div className="flex items-center gap-2">
                          <ArrowRight size={12} />
                          <span>
                            {formatFileSize(
                              currentPreview.stats.compressedSize
                            )}
                          </span>
                          <span className="text-gray-600">节省</span>
                          <span className="font-semibold text-green-600">
                            {currentPreview.stats.compressionRatio.toFixed(1)}%
                          </span>
                        </div>
                      }
                    </p>

                  </div>

                  {/* 进度条 */}
                  <div className="flex flex-1 items-center gap-2 text-sm text-gray-600">
                    <span>压缩进度</span>
                    <Progress value={progress} className="flex-1" />
                    <span>{completedCount}/{totalCount}</span>
                  </div>
                  {/* 操作按钮 */}
                  <div className="flex shrink-0 items-center gap-3">
                    <ButtonGroup>
                      <Button
                        variant="secondary"
                        onClick={() => setIsSettingsOpen(true)}
                      >
                        <Bolt />
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleStartCompression}
                        disabled={imageFiles.length === 0}
                      >
                        <Play size={16} />
                        开始压缩
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="More Options">
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='bg-white'>
                          <DropdownMenuItem onClick={handleSaveCurrent}>
                            <Download />
                            保存当前
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </ButtonGroup>
                  </div>


                </div>
                {/* 图片列表区域 */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* 添加图片按钮 - sticky */}
                  <div className="sticky left-0 z-10">
                    <Button
                      variant="outline"
                      className="w-20 h-20 flex flex-col cursor-pointer gap-1 bg-gray-100 hover:bg-gray-200 border-1 border-dashed border-gray-300"
                      onClick={handleAddMoreImages}
                    >
                      <Plus size={14} />
                      <span className="text-xs">添加</span>
                    </Button>
                  </div>

                  {/* 图片列表 */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 flex-1 min-w-0">
                    {imageFiles.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectImage(index)}
                        className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${index === selectedIndex
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <img
                          src={URL.createObjectURL(img.file)}
                          alt={img.file.name}
                          className="w-full h-full object-cover"
                        />
                        {/* 删除按钮 - hover显示 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        {/* 遮罩和状态 */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {img.status === 'pending' && (
                            <div className="text-white text-xs">等待</div>
                          )}
                          {img.status === 'processing' && (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          )}
                          {img.status === 'completed' && (
                            <div className="text-green-400 text-lg">✓</div>
                          )}
                          {img.status === 'error' && (
                            <div className="text-red-400 text-lg">✗</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 图片对比区域 - 占据剩余空间 */}
          <div className="flex-1 m-4 mt-0 relative bg-gray-100 overflow-hidden rounded-lg">
            {currentPreview && (
              <ImageComparison
                originalUrl={originalImageUrl}
                compressedUrl={compressedImageUrl}
                scale={imageTransform.scale}
                rotation={imageTransform.rotation}
                onScaleChange={(scale) => setImageTransform(prev => ({ ...prev, scale }))}
                onRotationChange={(rotation) => setImageTransform(prev => ({ ...prev, rotation }))}
              />
            )}

            {/* 顶部悬浮操作栏 */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg px-2 py-1 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" title="放大" onClick={handleZoomIn}>
                <ZoomIn />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" title="缩小" onClick={handleZoomOut}>
                <ZoomOut />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" title="逆时针旋转90°" onClick={() => handleRotate(false)}>
                <RotateCcwSquare />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" title="顺时针旋转90°" onClick={() => handleRotate(true)}>
                <RotateCwSquare />
              </Button>
            </div>

            {/* 设置面板 - CompressorSettings有自己的悬浮按钮和Drawer */}
            <CompressorSettings
              open={isSettingsOpen}
              onOpenChange={setIsSettingsOpen}
              settings={settings}
              onApply={applySettings}
              onReset={resetSettings}
              onChangeSavePath={handleChangeSavePath}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCompressor;
