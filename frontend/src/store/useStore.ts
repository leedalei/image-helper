import { create } from 'zustand';

/**
 * 图片文件接口
 */
export interface ImageFile {
  file: File;
  originalImageData: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

/**
 * 压缩预览数据接口
 */
export interface PreviewData {
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

/**
 * 压缩设置接口
 */
export interface CompressionSettings {
  quality: number;
  format: string;
  targetWidth: number;
  targetHeight: number;
  keepAspectRatio: boolean;
  progressive: boolean;
  optimize: boolean;
  batchSavePath: string;
}

/**
 * 图片变换接口
 */
export interface ImageTransform {
  scale: number;
  rotation: number;
}

/**
 * 编辑器图片变换接口（支持独立缩放）
 */
export interface EditorImageTransform {
  originalScale: number;
  previewScale: number;
  rotation: number;
}

/**
 * 压缩页面状态接口
 */
export interface CompressorPageState {
  selectedFiles: FileList | null;
  imageFiles: ImageFile[];
  selectedIndex: number;
  settings: CompressionSettings;
  currentPreview: PreviewData | null;
  isCompressionStarted: boolean;
  isSettingsOpen: boolean;
  imageTransform: ImageTransform;
}

/**
 * 编辑图片文件接口
 */
export interface EditorImageFile {
  file: File;
  originalImageData: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

/**
 * 编辑预览数据接口
 */
export interface EditorPreviewData {
  imageData: string;
  blob: Blob;
  stats: {
    width: number;
    height: number;
    format: string;
    operations: string[];
  };
}

/**
 * 编辑设置接口
 */
export interface EditorSettings {
  // 尺寸调整
  targetWidth: number;
  targetHeight: number;
  keepAspectRatio: boolean;
  
  // 水印
  watermarkType: 'none' | 'image' | 'text';
  watermarkImage: string | null;
  watermarkText: string;
  watermarkOpacity: number;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'tile';
  watermarkDensity: 'sparse' | 'medium' | 'dense';
  watermarkFontSize: number;
  watermarkFontColor: string;
  watermarkFontStyle: 'normal' | 'bold' | 'italic';
  
  // 旋转
  rotationAngle: number;
  
  // 批量保存
  batchSavePath: string;
}

/**
 * 编辑页面状态接口
 */
export interface EditorPageState {
  selectedFiles: FileList | null;
  imageFiles: EditorImageFile[];
  selectedIndex: number;
  settings: EditorSettings;
  currentPreview: EditorPreviewData | null;
  isEditingStarted: boolean;
  isSettingsOpen: boolean;
  imageTransform: EditorImageTransform;
}

/**
 * 应用状态接口
 */
interface AppState {
  // 压缩页面状态
  compressorState: CompressorPageState;
  setCompressorState: (state: Partial<CompressorPageState>) => void;
  resetCompressorState: () => void;
  
  // 编辑页面状态
  editorState: EditorPageState;
  setEditorState: (state: Partial<EditorPageState>) => void;
  resetEditorState: () => void;
  
  // 当前活动页面
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}

/**
 * 压缩页面默认状态
 */
const defaultCompressorState: CompressorPageState = {
  selectedFiles: null,
  imageFiles: [],
  selectedIndex: 0,
  settings: {
    quality: 80,
    format: 'original',
    targetWidth: 0,
    targetHeight: 0,
    keepAspectRatio: true,
    progressive: true,
    optimize: true,
    batchSavePath: '',
  },
  currentPreview: null,
  isCompressionStarted: false,
  isSettingsOpen: false,
  imageTransform: {
    scale: 1,
    rotation: 0,
  },
};

/**
 * 编辑页面默认状态
 */
const defaultEditorState: EditorPageState = {
  selectedFiles: null,
  imageFiles: [],
  selectedIndex: 0,
  settings: {
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
    batchSavePath: '',
  },
  currentPreview: null,
  isEditingStarted: false,
  isSettingsOpen: false,
  imageTransform: {
    originalScale: 1,
    previewScale: 1,
    rotation: 0,
  },
};

/**
 * 应用全局状态管理
 * 
 * 使用 Zustand 管理页面状态，实现页面切换时的状态保存和恢复
 * 需求：1.8
 */
export const useStore = create<AppState>((set) => ({
  // 压缩页面状态
  compressorState: defaultCompressorState,
  setCompressorState: (state) =>
    set((prev) => ({
      compressorState: { ...prev.compressorState, ...state },
    })),
  resetCompressorState: () =>
    set({ compressorState: defaultCompressorState }),
  
  // 编辑页面状态
  editorState: defaultEditorState,
  setEditorState: (state) =>
    set((prev) => ({
      editorState: { ...prev.editorState, ...state },
    })),
  resetEditorState: () =>
    set({ editorState: defaultEditorState }),
  
  // 当前活动页面
  currentRoute: '/compress',
  setCurrentRoute: (route) => set({ currentRoute: route }),
}));
