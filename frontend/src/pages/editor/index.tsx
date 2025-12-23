import { useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../../components/ui/card';
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
import ImageEditPreview from '../../components/ImageEditPreview';
import EditorSettings from '../../components/EditorSettings';
// @ts-ignore - Wails bindings are auto-generated JavaScript
import { Editor } from '../../../bindings/changeme/editor';
// @ts-ignore - Wails bindings are auto-generated JavaScript
import { Compressor } from '../../../bindings/changeme/compressor';
import { Plus, X, Ellipsis, Download, Play, Bolt } from 'lucide-react';
import { base64ToBlob, fileToBase64, formatFileSize, getMimeTypeFromExtension } from '@/lib/utils';
import {
  notifySettingsUpdated,
  notifySettingsReset,
  notifySavePathUpdated,
  notifyBatchEditComplete,
  notifyImageSaved,
  notifyZipSaved,
  notifySavePathRequired,
  notifyNoDataToSave,
} from '@/lib/toast';
import {
  handleFileReadError,
  handleEditError,
  handleSaveError,
  handleFileSelectError,
  handlePathSelectError,
  isDialogCancelled,
} from '@/lib/errorHandler';
import { useStore, EditorImageFile, EditorSettings as EditorSettingsType } from '../../store/useStore';

const { EditImage, BatchEdit, BatchSaveToZip, SaveImage, SaveFileDialog, SelectDirectoryDialog } = Editor;
const { ReadImageFile, OpenFileDialog } = Compressor;

/**
 * 图片编辑页面
 * 
 * 使用 Zustand store 管理状态，实现页面切换时的状态保持
 * 需求：1.8, 18.1-18.6, 19.1-19.10
 */
function ImageEditor() {
  const { editorState, setEditorState } = useStore();
  const {
    selectedFiles,
    imageFiles,
    selectedIndex,
    settings,
    currentPreview,
    isEditingStarted,
    isSettingsOpen,
    imageTransform,
  } = editorState;

  // 使用 ref 保存最新状态，避免闭包问题
  const imageFilesRef = useRef(imageFiles);
  const selectedIndexRef = useRef(selectedIndex);
  const scaleDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef(settings);
  const imageTransformRef = useRef(imageTransform);

  // 同步 ref 和状态
  useEffect(() => {
    imageFilesRef.current = imageFiles;
  }, [imageFiles]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    imageTransformRef.current = imageTransform;
  }, [imageTransform]);

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      if (scaleDebounceTimerRef.current) {
        clearTimeout(scaleDebounceTimerRef.current);
      }
    };
  }, []);

  const currentFile = imageFiles[selectedIndex] || null;

  const originalImageUrl = useMemo(() => {
    if (!currentFile?.file) return null;
    return URL.createObjectURL(currentFile.file);
  }, [currentFile?.file]);

  const editedImageUrl = useMemo(() => {
    if (currentPreview?.blob) {
      return URL.createObjectURL(currentPreview.blob);
    }
    return null;
  }, [currentPreview?.blob]);

  // 预览编辑图片（不更新status）
  const previewImageWithBackend = async (
    base64Data: string,
    _file: File
  ) => {
    try {
      const options = buildEditOptions();
      const result = await EditImage(base64Data, JSON.stringify(options));
      const parsed = JSON.parse(result);

      const mimeType = `image/${parsed.format}`;
      const blob = base64ToBlob(parsed.imageData, mimeType);

      // 更新当前预览对象
      setEditorState({
        currentPreview: {
          imageData: parsed.imageData,
          blob: blob,
          stats: {
            width: parsed.width,
            height: parsed.height,
            format: parsed.format,
            operations: parsed.operations || [],
          },
        },
      });
    } catch (error) {
      console.error('预览编辑失败:', error);
    }
  };

  // 构建编辑选项（用于预览，不包含旋转，旋转通过CSS实现）
  const buildEditOptions = (includeRotation: boolean = false) => {
    const options: any = {};

    // 尺寸调整
    if (settings.targetWidth > 0 || settings.targetHeight > 0) {
      options.resize = {
        width: settings.targetWidth,
        height: settings.targetHeight,
        keepAspectRatio: settings.keepAspectRatio,
      };
    }

    // 旋转 - 仅在最终保存时包含，预览时通过CSS实现
    if (includeRotation && settings.rotationAngle !== 0) {
      options.rotate = {
        angle: settings.rotationAngle,
      };
    }

    // 水印
    if (settings.watermarkType === 'text' && settings.watermarkText) {
      options.textWatermark = {
        text: settings.watermarkText,
        opacity: settings.watermarkOpacity / 100,
        position: settings.watermarkPosition,
        density: settings.watermarkDensity,
        fontSize: settings.watermarkFontSize,
        fontColor: settings.watermarkFontColor,
        fontStyle: settings.watermarkFontStyle,
      };
    }

    return options;
  };

  // 使用Go后端编辑图片（更新status）
  const _editImageWithBackend = async (
    base64Data: string,
    _file: File,
    index: number
  ) => {
    try {
      // 更新状态为处理中
      const newImageFiles = [...imageFiles];
      newImageFiles[index] = { ...newImageFiles[index], status: 'processing' as const };
      setEditorState({ imageFiles: newImageFiles });

      const options = buildEditOptions();
      const result = await EditImage(base64Data, JSON.stringify(options));
      const parsed = JSON.parse(result);

      const mimeType = `image/${parsed.format}`;
      const blob = base64ToBlob(parsed.imageData, mimeType);

      // 更新图片文件状态
      const updatedImageFiles = [...imageFilesRef.current];
      updatedImageFiles[index] = {
        ...updatedImageFiles[index],
        originalImageData: base64Data,
        status: 'completed' as const
      };
      setEditorState({ imageFiles: updatedImageFiles });

      // 更新当前预览对象
      setEditorState({
        currentPreview: {
          imageData: parsed.imageData,
          blob: blob,
          stats: {
            width: parsed.width,
            height: parsed.height,
            format: parsed.format,
            operations: parsed.operations || [],
          },
        },
      });
    } catch (error) {
      console.error('编辑失败:', error);
      const updatedImageFiles = [...imageFilesRef.current];
      updatedImageFiles[index] = { ...updatedImageFiles[index], status: 'error' as const };
      setEditorState({ imageFiles: updatedImageFiles });
    }
  };

  // 处理文件选择
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setEditorState({
        selectedFiles: null,
        imageFiles: [],
        isEditingStarted: false,
        currentPreview: null,
      });
      return;
    }

    const newImageFiles: EditorImageFile[] = Array.from(files).map(file => ({
      file,
      originalImageData: null,
      status: 'pending' as const
    }));

    setEditorState({
      selectedFiles: files,
      imageFiles: newImageFiles,
      selectedIndex: 0,
      isEditingStarted: false,
    });

    // 立即选中第一张图片并预览
    const firstImage = newImageFiles[0];
    if (firstImage) {
      fileToBase64(firstImage.file)
        .then(base64Data => previewImageWithBackend(base64Data, firstImage.file))
        .catch(error => {
          console.error('读取文件失败:', error);
        });
    }
  };

  // 添加更多图片
  const handleAddMoreImages = async () => {
    try {
      const filePaths = await OpenFileDialog();
      if (!filePaths || (Array.isArray(filePaths) && filePaths.length === 0)) {
        return;
      }

      const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

      try {
        const files: File[] = [];
        for (const filePath of paths) {
          try {
            const base64Data = await ReadImageFile(filePath);
            const fileName = filePath.split('/').pop() || 'image.jpg';
            const extension = fileName.split('.').pop()?.toLowerCase();
            const mimeType = getMimeTypeFromExtension(extension || '');

            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const file = new File([blob], fileName, { type: mimeType });
            files.push(file);
          } catch (error) {
            console.error(`读取文件失败: ${filePath}`, error);
          }
        }

        if (files.length > 0) {
          const dt = new DataTransfer();
          imageFiles.forEach(img => dt.items.add(img.file));
          files.forEach(file => dt.items.add(file));

          const newImageFiles: EditorImageFile[] = files.map(file => ({
            file,
            originalImageData: null,
            status: 'pending' as const
          }));

          const wasEmpty = imageFiles.length === 0;
          setEditorState({
            imageFiles: [...imageFiles, ...newImageFiles],
            selectedFiles: dt.files,
          });

          if (wasEmpty) {
            setEditorState({ selectedIndex: 0 });
            const firstNewImage = newImageFiles[0];
            if (firstNewImage) {
              fileToBase64(firstNewImage.file)
                .then(base64Data => previewImageWithBackend(base64Data, firstNewImage.file))
                .catch(error => {
                  console.error('读取文件失败:', error);
                });
            }
          }
        }
      } catch (error) {
        handleFileReadError(error);
      }
    } catch (error) {
      handleFileSelectError(error);
    }
  };

  // 应用设置变更
  const applySettings = (newSettings: EditorSettingsType) => {
    const hasChanges = JSON.stringify(newSettings) !== JSON.stringify(settings);

    setEditorState({ settings: newSettings });

    if (hasChanges) {
      // 重置所有图片的status和当前预览
      const resetImageFiles = imageFiles.map(img => ({
        ...img,
        status: 'pending' as const,
      }));
      setEditorState({
        imageFiles: resetImageFiles,
        currentPreview: null,
        isEditingStarted: false,
      });

      // 同步旋转角度到图像变换状态（用于CSS预览）
      if (newSettings.rotationAngle !== imageTransform.rotation) {
        setEditorState({
          imageTransform: {
            ...imageTransform,
            rotation: newSettings.rotationAngle,
          },
        });
      }

      // 重新预览当前选中的图片，使用新的设置
      const currentImage = imageFilesRef.current[selectedIndexRef.current];
      if (currentImage) {
        fileToBase64(currentImage.file)
          .then(base64Data => previewImageWithSettings(base64Data, currentImage.file, newSettings))
          .catch(error => {
            console.error('读取文件失败:', error);
          });
      }

      notifySettingsUpdated();
    } else {
      notifySettingsUpdated();
    }
  };

  // 重置设置
  const resetSettings = () => {
    setEditorState({
      settings: {
        ...settings,
        targetWidth: 0,
        targetHeight: 0,
        keepAspectRatio: true,
        watermarkType: 'none',
        watermarkImage: null,
        watermarkText: '',
        watermarkOpacity: 50,
        watermarkPosition: 'bottom-right',
        watermarkDensity: 'medium',
        watermarkFontSize: 24,
        watermarkFontColor: '#ffffff',
        watermarkFontStyle: 'normal',
        rotationAngle: 0,
      },
    });
    notifySettingsReset();
  };

  // 更改批量保存路径
  const handleChangeSavePath = async (currentPath: string) => {
    try {
      const selectedPath = await SelectDirectoryDialog(currentPath);
      if (isDialogCancelled(selectedPath)) {
        return;
      }
      setEditorState({
        settings: { ...settings, batchSavePath: selectedPath },
      });
      notifySavePathUpdated();
    } catch (error) {
      handlePathSelectError(error);
    }
  };

  // 开始编辑所有文件
  const handleStartEditing = async () => {
    if (imageFiles.length === 0) return;

    // 检查是否配置了保存目录
    if (!settings.batchSavePath) {
      notifySavePathRequired();
      setEditorState({ isSettingsOpen: true });
      return;
    }

    setEditorState({ isEditingStarted: true });
    const processingImageFiles = imageFiles.map(img => ({ ...img, status: 'processing' as const }));
    setEditorState({ imageFiles: processingImageFiles });

    try {
      // 最终保存时包含旋转
      const options = buildEditOptions(true);

      // 将所有图片转换为base64数据
      const base64DataList: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const base64Data = await fileToBase64(imageFiles[i].file);
        base64DataList.push(base64Data);
      }

      // 调用批量编辑接口
      const result = await BatchEdit(base64DataList, JSON.stringify(options));
      const parsed = JSON.parse(result);

      // 更新所有图片状态
      const updatedImageFiles = imageFiles.map((img, index) => ({
        ...img,
        originalImageData: base64DataList[index],
        status: 'completed' as const
      }));
      setEditorState({ imageFiles: updatedImageFiles });

      // 自动保存到ZIP文件
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-');
      const zipFilename = `edited_images_${timestamp}.zip`;

      // 准备文件名列表
      const filenames = imageFiles.map((img) => {
        const baseName = img.file.name.split('.')[0];
        return `${baseName}_edited.png`;
      });

      // 调用批量保存到ZIP接口
      const zipResult = await BatchSaveToZip(
        parsed.results,
        settings.batchSavePath,
        zipFilename,
        JSON.stringify(filenames)
      );

      notifyBatchEditComplete(parsed.successCount, parsed.failedCount);
      notifyZipSaved(zipResult);
    } catch (error) {
      handleEditError(error);
      const errorImageFiles = imageFiles.map(img => ({ ...img, status: 'error' as const }));
      setEditorState({ imageFiles: errorImageFiles });
    }
  };

  // 删除图片
  const handleRemoveImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    
    let newSelectedIndex = selectedIndex;
    if (selectedIndex >= newImageFiles.length) {
      newSelectedIndex = Math.max(0, newImageFiles.length - 1);
    } else if (selectedIndex > index) {
      newSelectedIndex = selectedIndex - 1;
    }

    if (newImageFiles.length === 0) {
      setEditorState({
        selectedFiles: null,
        imageFiles: [],
        selectedIndex: 0,
        currentPreview: null,
      });
    } else {
      const dt = new DataTransfer();
      newImageFiles.forEach(img => dt.items.add(img.file));
      setEditorState({
        selectedFiles: dt.files,
        imageFiles: newImageFiles,
        selectedIndex: newSelectedIndex,
      });
    }
  };

  // 选中图片时进行预览编辑
  const handleSelectImage = (index: number) => {
    setEditorState({ selectedIndex: index, currentPreview: null });
    const imageFile = imageFiles[index];

    const processPreview = (base64Data: string) => {
      previewImageWithBackend(base64Data, imageFile.file);
    };

    if (imageFile.originalImageData) {
      processPreview(imageFile.originalImageData);
    } else {
      fileToBase64(imageFile.file)
        .then(processPreview)
        .catch(error => {
          console.error('读取文件失败:', error);
        });
    }
  };

  // 图像变换处理函数 - 原图缩放由 ImageEditPreview 组件内部处理
  // 预览图旋转处理 - 同时更新编辑设置中的旋转角度
  // 注意：预览图的旋转只是CSS视觉变换，不需要调用后端重新渲染
  // 后端的旋转设置是用于最终保存时的
  const handlePreviewRotate = (isClockwise: boolean) => {
    const newRotation = isClockwise
      ? (imageTransform.rotation + 90) % 360
      : (imageTransform.rotation - 90 + 360) % 360;
    
    // 更新图像变换状态（CSS视觉旋转）
    setEditorState({
      imageTransform: {
        ...imageTransform,
        rotation: newRotation,
      },
    });
    
    // 同时更新编辑设置中的旋转角度（用于最终保存）
    setEditorState({
      settings: {
        ...settings,
        rotationAngle: newRotation,
      },
    });
    // 不需要重新调用后端渲染，因为旋转只是CSS变换
  };

  // 预览图缩放处理 - 更新视觉缩放，并在操作结束后（防抖）更新设置中的宽高
  const handlePreviewScaleChange = useCallback((newScale: number) => {
    // 使用 ref 获取最新的 imageTransform，避免闭包问题
    const currentTransform = imageTransformRef.current;
    
    setEditorState({
      imageTransform: {
        ...currentTransform,
        previewScale: newScale,
      },
    });

    // 清除之前的定时器
    if (scaleDebounceTimerRef.current) {
      clearTimeout(scaleDebounceTimerRef.current);
    }

    // 设置新的定时器，在操作结束后更新设置中的宽高
    scaleDebounceTimerRef.current = setTimeout(() => {
      const currentImage = imageFilesRef.current[selectedIndexRef.current];
      if (currentImage?.file) {
        // 获取原始图片尺寸
        const img = new Image();
        img.onload = () => {
          const originalWidth = img.naturalWidth;
          const originalHeight = img.naturalHeight;
          
          // 根据缩放比例计算新的宽高
          const newWidth = Math.round(originalWidth * newScale);
          const newHeight = Math.round(originalHeight * newScale);
          
          // 更新编辑设置中的宽度和高度
          const currentSettings = settingsRef.current;
          setEditorState({
            settings: {
              ...currentSettings,
              targetWidth: newWidth,
              targetHeight: newHeight,
            },
          });
        };
        img.src = URL.createObjectURL(currentImage.file);
      }
    }, 300); // 300ms 防抖延迟
  }, [setEditorState]);

  // 使用指定设置预览图片
  const previewImageWithSettings = async (
    base64Data: string,
    _file: File,
    customSettings: EditorSettingsType
  ) => {
    try {
      const options = buildEditOptionsWithSettings(customSettings);
      const result = await EditImage(base64Data, JSON.stringify(options));
      const parsed = JSON.parse(result);

      const mimeType = `image/${parsed.format}`;
      const blob = base64ToBlob(parsed.imageData, mimeType);

      setEditorState({
        currentPreview: {
          imageData: parsed.imageData,
          blob: blob,
          stats: {
            width: parsed.width,
            height: parsed.height,
            format: parsed.format,
            operations: parsed.operations || [],
          },
        },
      });
    } catch (error) {
      console.error('预览编辑失败:', error);
    }
  };

  // 使用指定设置构建编辑选项（用于预览，不包含旋转，旋转通过CSS实现）
  const buildEditOptionsWithSettings = (customSettings: EditorSettingsType, includeRotation: boolean = false) => {
    const options: any = {};

    // 尺寸调整
    if (customSettings.targetWidth > 0 || customSettings.targetHeight > 0) {
      options.resize = {
        width: customSettings.targetWidth,
        height: customSettings.targetHeight,
        keepAspectRatio: customSettings.keepAspectRatio,
      };
    }

    // 旋转 - 仅在最终保存时包含，预览时通过CSS实现
    if (includeRotation && customSettings.rotationAngle !== 0) {
      options.rotate = {
        angle: customSettings.rotationAngle,
      };
    }

    // 水印
    if (customSettings.watermarkType === 'text' && customSettings.watermarkText) {
      options.textWatermark = {
        text: customSettings.watermarkText,
        opacity: customSettings.watermarkOpacity / 100,
        position: customSettings.watermarkPosition,
        density: customSettings.watermarkDensity,
        fontSize: customSettings.watermarkFontSize,
        fontColor: customSettings.watermarkFontColor,
        fontStyle: customSettings.watermarkFontStyle,
      };
    }

    return options;
  };

  // 判断是否为单图模式
  const isSingleImageMode = imageFiles.length < 2;

  // 计算编辑进度
  const completedCount = imageFiles.filter(img => img.status === 'completed').length;
  const totalCount = imageFiles.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // 保存当前选中的图片
  const handleSaveCurrent = async () => {
    if (!currentFile) {
      notifyNoDataToSave();
      return;
    }

    try {
      // 获取原始图片的 base64 数据
      const base64Data = await fileToBase64(currentFile.file);
      
      // 使用包含旋转的编辑选项重新编辑图片
      const options = buildEditOptions(true);
      const result = await EditImage(base64Data, JSON.stringify(options));
      const parsed = JSON.parse(result);

      const baseName = currentFile.file.name.split('.')[0];
      const filename = `${baseName}_edited.png`;

      const filePath = await SaveFileDialog(filename, parsed.imageData, 'image/png');
      if (isDialogCancelled(filePath)) return;

      const saveResult = await SaveImage(
        parsed.imageData,
        filePath.substring(0, filePath.lastIndexOf('/')),
        filePath.substring(filePath.lastIndexOf('/') + 1),
        true
      );

      notifyImageSaved(saveResult);
    } catch (error) {
      handleSaveError(error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!currentFile ? (
        // 文件选择器
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mx-auto mb-4">
            <h1 className="text-3xl font-bold text-center">大雷图片编辑器</h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
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
          {/* 文件信息栏 */}
          <Card className="m-4">
            <CardContent>
              <div className="flex flex-col gap-2 min-w-0">
                {/* 上方：设置、图片列表和进度条、操作、文件信息 */}
                <div className="flex-1 gap-3 flex min-w-0">
                  {/* 当前图片信息 */}
                  <div className="w-[450px] shrink-0">
                    <p className="font-medium text-gray-900 truncate break-words">{currentFile.file.name}</p>
                    <p className="flex-wrap text-sm text-gray-500 flex items-center gap-1">
                      <span>文件大小: {formatFileSize(currentFile.file.size)} </span>
                      {currentPreview?.stats && (
                        <span className="text-gray-600">
                          | 尺寸: {currentPreview.stats.width} x {currentPreview.stats.height}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* 进度条 - 仅在多图模式下显示 */}
                  {!isSingleImageMode && (
                    <div className="flex flex-1 items-center gap-2 text-sm text-gray-600">
                      <span>编辑进度</span>
                      <Progress value={progress} className="flex-1" />
                      <span>{completedCount}/{totalCount}</span>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex shrink-0 items-center gap-3">
                    <ButtonGroup>
                      <Button
                        variant="secondary"
                        onClick={() => setEditorState({ isSettingsOpen: true })}
                      >
                        <Bolt />
                      </Button>
                      <Button
                        variant="default"
                        onClick={isSingleImageMode ? handleSaveCurrent : handleStartEditing}
                        disabled={imageFiles.length === 0}
                      >
                        <Play size={16} />
                        {isSingleImageMode ? '保存' : '批量编辑'}
                      </Button>
                      {!isSingleImageMode && (
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
                      )}
                    </ButtonGroup>
                  </div>
                </div>

                {/* 图片列表区域 */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* 添加图片按钮 */}
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
                        className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          index === selectedIndex
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={URL.createObjectURL(img.file)}
                          alt={img.file.name}
                          className="w-full h-full object-cover"
                        />
                        {/* 删除按钮 */}
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

          {/* 图片对比区域 */}
          <div className="flex-1 m-4 mt-0 relative bg-gray-100 overflow-hidden rounded-lg">
            <ImageEditPreview
              originalUrl={originalImageUrl}
              editedUrl={editedImageUrl}
              originalScale={imageTransform.originalScale}
              previewScale={imageTransform.previewScale}
              rotation={imageTransform.rotation}
              onOriginalScaleChange={(scale: number) => setEditorState({ imageTransform: { ...imageTransform, originalScale: scale } })}
              onPreviewScaleChange={handlePreviewScaleChange}
              onPreviewRotate={handlePreviewRotate}
            />

            {/* 设置面板 */}
            <EditorSettings
              open={isSettingsOpen}
              onOpenChange={(open: boolean) => setEditorState({ isSettingsOpen: open })}
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

export default ImageEditor;
