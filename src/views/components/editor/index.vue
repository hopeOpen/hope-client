<template>
  <div class="editor-wrapper" @click="handleShowEditor" :class="showEditor && 'focus-style'">
    <p v-if="showTips" class="plo">{{ props.placeholder }}</p>
    <template v-if="showEditor">
      <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor
        class="editor"
        style="height: 58px; overflow-y: hidden"
        v-model="htmlValue"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onBlur="handleBlur"
      />
    </template>
    <p class="content" v-show="showContent" v-html="htmlValue"></p>
  </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { ref, shallowRef, onBeforeUnmount, computed, defineEmits, defineProps } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
const emit = defineEmits(['update:html']);
const props = defineProps({
  html: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  currentIndex: {
    type: Number,
    default: 0
  }
});
const showEditor = ref(false);
const editorRef = shallowRef();
const toolbarConfig = {
  excludeKeys: [],
  toolbarKeys: [
    {
      key: 'group-header',
      title: 'H',
      menuKeys: ['header1', 'header2', 'header3', 'header4', 'header5']
    },
    'bold',
    'clearStyle',
    'lineHeight',
    'divider',
    'emotion',
    'blockquote',
    'headerSelect',
    'todo',
    {
      key: 'group-code',
      title: 'code',
      menuKeys: ['code', 'codeBlock']
    },
    {
      key: 'group-indent',
      title: '缩进',
      menuKeys: ['indent', 'delIndent']
    },
    {
      key: 'group-list',
      title: 'list',
      menuKeys: ['bulletedList', 'numberedList']
    },
    {
      key: 'group-font',
      title: 'font',
      menuKeys: ['underline', 'italic', 'through', 'color', 'bgColor', 'fontSize', 'sub', 'sup']
    },
    {
      key: 'group-link',
      title: 'link',
      menuKeys: ['insertLink', 'viewLink', 'editLink', 'unLink']
    },
    {
      key: 'group-justify',
      title: 'justify',
      menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify']
    },
    {
      key: 'group-table',
      title: 'table',
      menuKeys: [
        'insertTable',
        'deleteTable',
        'insertTableRow',
        'deleteTableRow',
        'insertTableCol',
        'deleteTableCol',
        'tableHeader',
        'tableFullWidth'
      ]
    },
    'fullScreen',
    'redo',
    'undo'
  ]
};
const editorConfig = { placeholder: '请输入内容...' };
const mode = 'simple';

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  // eslint-disable-next-line no-eq-null
  if (editor == null) return;
  editor.destroy();
});
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleBlur = () => {
  if (htmlValue.value === '<p><br></p>') {
    emit('update:html', '');
  }
  showEditor.value = false;
  emit('update:html', htmlValue.value, props.currentIndex);
};
const handleShowEditor = () => {
  showEditor.value = true;
};

// 是否显示内容
const showContent = computed((): boolean | string => {
  return !showEditor.value && htmlValue.value;
});
// 是否显示提示
const showTips = computed((): boolean | string => {
  return !showContent.value && !showEditor.value;
});

const htmlValue = computed({
  get() {
    return props.html;
  },
  set(val) {
    emit('update:html', val);
  }
});
</script>
<style lang="scss">
.editor-wrapper {
  flex: 1;
  border-radius: 2px;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #1a8cfe;
  }
  &.focus-style {
    &:hover {
      border: 1px solid transparent;
      box-shadow: 0px 0px 23px -12px rgba(142, 151, 242, 0.76);
    }
  }
  .plo {
    margin-left: 10px;
    color: #ccc;
  }
  .content {
    margin-left: 10px;
  }
  .toolbar {
    width: calc(100% + 2px);
    border: 1px solid #ccc;
  }
  .editor {
    width: calc(100% + 2px);
    border: 1px solid #ccc;
    border-top: none;
  }
  // wangeditor覆盖样式
  ol,
  ul {
    margin-left: -10px;
  }
}
</style>
