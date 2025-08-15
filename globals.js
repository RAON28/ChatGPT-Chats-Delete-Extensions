if (typeof window.globalsLoaded === "undefined") {
  window.globalsLoaded = true;

  const Selectors = {
    conversationsCheckbox: ".conversation-checkbox:checked",
    confirmDeleteButton: "button.btn.btn-danger",
    threeDotButton: '[id^="radix-"]',
    HISTORY: '[id^="history"]',
    CONVERSATION_SELECTOR: "a",
    TITLE_SELECTOR: ".relative.grow.overflow-hidden.whitespace-nowrap",
    INTERACTIVE_ELEMENT_SELECTOR: "button",
  };

  const CHECKBOX_CLASS = "conversation-checkbox";

  const translations = {
    ko: {
      chatDelete: "채팅삭제",
      cancel: "취소",
      delete: "삭제",
      confirm: "확인",
      confirmDelete: "선택된 대화를 삭제하시겠습니까?",
      deleteComplete: "삭제가 완료되었습니다.",
      noChatsSelected: "선택한 채팅이 없습니다.",
      selectAll: "전체선택",
      cannotDeleteConversation: "대화를 삭제할 수 없습니다: \"{title}\".",
      availableOnChatGPT: "ChatGPT 페이지에서 사용 가능",
      onlyAvailableOnChatGPT: "ChatGPT 페이지에서만 사용 가능",
      popupTitle: "ChatGPT 채팅 삭제",
      popupDescription: "ChatGPT 페이지에서 채팅삭제 버튼을 클릭하여 대화를 일괄 삭제할 수 있습니다.",
      extName: "ChatGPT 채팅 삭제",
      extDescription: "ChatGPT에서 채팅을 일괄 삭제할 수 있는 확장 프로그램",
      deletingInProgress: "삭제 중입니다...",
      deletingProgress: "삭제 중... ({current}/{total})"
    },
    en: {
      chatDelete: "Delete Chats",
      cancel: "Cancel",
      delete: "Delete",
      confirm: "OK",
      confirmDelete: "Are you sure you want to delete the selected conversations?",
      deleteComplete: "Deletion completed.",
      noChatsSelected: "No chats selected.",
      selectAll: "Select All",
      cannotDeleteConversation: "Cannot delete conversation: \"{title}\".",
      availableOnChatGPT: "Available on ChatGPT page",
      onlyAvailableOnChatGPT: "Only available on ChatGPT page",
      popupTitle: "ChatGPT Chats Delete",
      popupDescription: "Click the delete button on the ChatGPT page to bulk delete conversations.",
      extName: "ChatGPT Chats Delete",
      extDescription: "Browser extension to bulk delete ChatGPT conversations",
      deletingInProgress: "Deleting in progress...",
      deletingProgress: "Deleting... ({current}/{total})"
    },
    ja: {
      chatDelete: "チャット削除",
      cancel: "キャンセル",
      delete: "削除",
      confirm: "確認",
      confirmDelete: "選択された会話を削除しますか？",
      deleteComplete: "削除が完了しました。",
      noChatsSelected: "選択されたチャットがありません。",
      selectAll: "すべて選択",
      cannotDeleteConversation: "会話を削除できません: \"{title}\".",
      availableOnChatGPT: "ChatGPTページで利用可能",
      onlyAvailableOnChatGPT: "ChatGPTページでのみ利用可能",
      popupTitle: "ChatGPTチャット削除",
      popupDescription: "ChatGPTページの削除ボタンをクリックして会話を一括削除できます。",
      extName: "ChatGPTチャット削除",
      extDescription: "ChatGPTでチャットを一括削除できるブラウザ拡張機能",
      deletingInProgress: "削除中です...",
      deletingProgress: "削除中... ({current}/{total})"
    },
    zh: {
      chatDelete: "删除聊天",
      cancel: "取消",
      delete: "删除",
      confirm: "确认",
      confirmDelete: "确定要删除选中的对话吗？",
      deleteComplete: "删除完成。",
      noChatsSelected: "未选择聊天。",
      selectAll: "全选",
      cannotDeleteConversation: "无法删除对话: \"{title}\".",
      availableOnChatGPT: "在ChatGPT页面可用",
      onlyAvailableOnChatGPT: "仅在ChatGPT页面可用",
      popupTitle: "ChatGPT聊天删除",
      popupDescription: "在ChatGPT页面点击删除按钮以批量删除对话。",
      extName: "ChatGPT聊天删除",
      extDescription: "批量删除ChatGPT对话的浏览器扩展",
      deletingInProgress: "正在删除...",
      deletingProgress: "删除中... ({current}/{total})"
    },
    es: {
      chatDelete: "Eliminar Chats",
      cancel: "Cancelar",
      delete: "Eliminar",
      confirm: "Confirmar",
      confirmDelete: "¿Estás seguro de que quieres eliminar las conversaciones seleccionadas?",
      deleteComplete: "Eliminación completada.",
      noChatsSelected: "No hay chats seleccionados.",
      selectAll: "Seleccionar todo",
      cannotDeleteConversation: "No se puede eliminar la conversación: \"{title}\".",
      availableOnChatGPT: "Disponible en la página de ChatGPT",
      onlyAvailableOnChatGPT: "Solo disponible en la página de ChatGPT",
      popupTitle: "Eliminar Chats de ChatGPT",
      popupDescription: "Haz clic en el botón de eliminar en la página de ChatGPT para eliminar conversaciones en masa.",
      extName: "ChatGPT Chats Delete",
      extDescription: "Extensión de navegador para eliminar conversaciones de ChatGPT en masa",
      deletingInProgress: "Eliminando en progreso...",
      deletingProgress: "Eliminando... ({current}/{total})"
    },
    de: {
      chatDelete: "Chats löschen",
      cancel: "Abbrechen",
      delete: "Löschen",
      confirm: "Bestätigen",
      confirmDelete: "Sind Sie sicher, dass Sie die ausgewählten Gespräche löschen möchten?",
      deleteComplete: "Löschung abgeschlossen.",
      noChatsSelected: "Keine Chats ausgewählt.",
      selectAll: "Alle auswählen",
      cannotDeleteConversation: "Konversation kann nicht gelöscht werden: \"{title}\".",
      availableOnChatGPT: "Verfügbar auf der ChatGPT-Seite",
      onlyAvailableOnChatGPT: "Nur auf der ChatGPT-Seite verfügbar",
      popupTitle: "ChatGPT Chat löschen",
      popupDescription: "Klicken Sie auf der ChatGPT-Seite auf die Löschen-Schaltfläche, um Gespräche in Massen zu löschen.",
      extName: "ChatGPT Chats Delete",
      extDescription: "Browser-Erweiterung zum Massenlöschen von ChatGPT-Gesprächen",
      deletingInProgress: "Löschung läuft...",
      deletingProgress: "Lösche... ({current}/{total})"
    }
  };

  function detectLanguage() {
    try {
      const chatGPTLang = detectChatGPTLanguage();
      if (chatGPTLang && translations[chatGPTLang]) {
        return chatGPTLang;
      }

      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        return browserLang;
      }

      return 'en';
    } catch (error) {
      return 'en';
    }
  }

  function detectChatGPTLanguage() {
    try {
      const html = document.documentElement;

      if (html.lang) {
        const lang = html.lang.split('-')[0];
        if (translations[lang]) return lang;
      }

      const path = window.location.pathname;
      if (path.includes('/ko/')) return 'ko';
      if (path.includes('/ja/')) return 'ja';
      if (path.includes('/zh/')) return 'zh';
      if (path.includes('/es/')) return 'es';
      if (path.includes('/de/')) return 'de';

      const uiElements = document.querySelectorAll('button, a, span, div');
      for (const element of uiElements) {
        const text = element.textContent?.toLowerCase() || '';
        if (text.includes('새로운 채팅') || text.includes('new chat')) return 'ko';
        if (text.includes('新しいチャット') || text.includes('new chat')) return 'ja';
        if (text.includes('新对话') || text.includes('new chat')) return 'zh';
        if (text.includes('nuevo chat') || text.includes('new chat')) return 'es';
        if (text.includes('neuer chat') || text.includes('new chat')) return 'de';
      }

    } catch (error) {
    }

    return null;
  }

  function t(key) {
    try {
      const currentLang = detectLanguage();
      const translation = translations[currentLang]?.[key] || translations['en'][key] || key;
      return translation;
    } catch (error) {
      return translations['en'][key] || key;
    }
  }

  window.Selectors = Selectors;
  window.shiftPressed = false;
  window.lastCheckedCheckbox = null;
  window.CHECKBOX_CLASS = CHECKBOX_CLASS;
  window.t = t; 
  window.detectLanguage = detectLanguage;
}