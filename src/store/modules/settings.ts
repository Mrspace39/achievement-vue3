import defaultSettings from "@/settings";
import { genMixColor } from "@/utils/color";
import { setStyleProperty } from "@/utils";
import { ThemeEnum } from "@/enums/ThemeEnum";

// 这句代码的意思是SettingsValue可以是boolean值, 也可以是string值
type SettingsValue = boolean | string;

/**
 * defineStore定义pinia store 这里使用 defineStore 来定义一个名为 "setting" 的 Pinia store，主要管理应用的各种设置选项。
 * 使用 useStorage 将每个设置选项与本地存储 (localStorage) 绑定。useStorage 是一种带有持久化功能的 ref，即它的值在页面刷新后仍会保存。
 */
export const useSettingsStore = defineStore("setting", () => {
  // 是否显示设置
  const settingsVisible = ref(false);
  // 是否显示标签视图
  const tagsView = useStorage<boolean>("tagsView", defaultSettings.tagsView);
  // 是否显示侧边栏logo
  const sidebarLogo = useStorage<boolean>(
    "sidebarLogo",
    defaultSettings.sidebarLogo
  );
  // 是否固定头部
  const fixedHeader = useStorage<boolean>(
    "fixedHeader",
    defaultSettings.fixedHeader
  );
  // 布局模式：left-左侧模式(默认) top-顶部模式 mix-混合模式
  const layout = useStorage<string>("layout", defaultSettings.layout);
  // 主题颜色
  const themeColor = useStorage<string>(
    "themeColor",
    defaultSettings.themeColor
  );
  // 主题：light-亮色(默认) dark-暗色
  const theme = useStorage<string>("theme", defaultSettings.theme);
  // 是否开启水印
  const watermarkEnabled = useStorage<boolean>(
    "watermarkEnabled",
    defaultSettings.watermarkEnabled
  );

  /**
   * 监听主题和主题颜色变化
   */
  watch(
    [theme, themeColor],
    ([newTheme, newThemeColor], [oldTheme, oldThemeColor]) => {
      if (newTheme !== oldTheme) {
        if (newTheme === ThemeEnum.DARK) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

      if (newThemeColor !== oldThemeColor) {
        const { DEFAULT, dark, light } = genMixColor(newThemeColor);
        setStyleProperty(`--el-color-primary`, DEFAULT);
        setStyleProperty(`--el-color-primary-dark-2`, dark[2]);
        setStyleProperty(`--el-color-primary-light-3`, light[3]);
        setStyleProperty(`--el-color-primary-light-5`, light[5]);
        setStyleProperty(`--el-color-primary-light-7`, light[7]);
        setStyleProperty(`--el-color-primary-light-8`, light[8]);
        setStyleProperty(`--el-color-primary-light-9`, light[9]);
      }
    },
    {
      immediate: true, // 立即执行，确保在侦听器创建时执行一次
    }
  );

  /**
   * 定义设置映射表
   * 这是一个映射表，将设置项的 key（如 fixedHeader）与相应的 ref 进行关联，方便在修改设置时动态访问这些设置项
   */
  const settingsMap: Record<string, Ref<SettingsValue>> = {
    fixedHeader,
    tagsView,
    sidebarLogo,
    layout,
    watermarkEnabled,
  };

  /**
   * 定义修改设置的方法
   * 这是一个通用的修改设置方法，通过传入 key 和 value 修改对应的设置项。例如，可以通过 changeSetting({ key: 'layout', value: 'top' }) 来改变布局模式
   * @param key
   * @param value
   */
  function changeSetting({
    key,
    value,
  }: {
    key: string;
    value: SettingsValue;
  }) {
    const setting = settingsMap[key];
    if (setting) {
      setting.value = value;
    }
  }

  /**
   * 切换主题
   */
  function changeTheme(val: string) {
    theme.value = val;
  }

  /**
   * 切换主题颜色
   *
   * @param color 主题颜色
   *
   */
  function changeThemeColor(color: string) {
    themeColor.value = color;
  }

  /**
   * 切换布局
   */
  function changeLayout(val: string) {
    layout.value = val;
  }

  return {
    settingsVisible,
    tagsView,
    fixedHeader,
    sidebarLogo,
    layout,
    themeColor,
    theme,
    watermarkEnabled,
    changeSetting,
    changeTheme,
    changeThemeColor,
    changeLayout,
  };
});
