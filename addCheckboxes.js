function getCurrentTheme() {
  const html = document.documentElement;
  return html.classList.contains('dark') ? 'dark' : 'light';
}

function getThemeColors() {
  const theme = getCurrentTheme();
  if (theme === 'dark') {
    return {
      primary: '#10a37f',
      background: '#343541',
      surface: '#424242',
      text: '#ffffff',
      border: '#4e4e4e',
      borderLight: '#4e4e4e',
      surfaceSecondary: '#424242',
      surfaceTertiary: '#3e3f4b'
    };
  } else {
    return {
      primary: '#10a37f',
      background: '#ffffff',
      surface: '#f7f7f8',
      text: '#000000',
      border: '#e5e5e5',
      borderLight: '#d0d0d0',
      surfaceSecondary: '#f7f7f8',
      surfaceTertiary: '#f0f0f0'
    };
  }
}

function createLoadingOverlay() {
  const colors = getThemeColors();
  const theme = getCurrentTheme();

  const overlay = document.createElement('div');
  overlay.id = 'chat-delete-loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10001;
    flex-direction: column;
  `;

  const loadingContainer = document.createElement('div');
  loadingContainer.style.cssText = `
    background: ${theme === 'dark' ? '#2f2f2f' : '#ffffff'};
    border: ${theme === 'dark' ? 'none' : `1px solid ${colors.borderLight}`};
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    min-width: 300px;
  `;

  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 40px;
    height: 40px;
    border: 3px solid ${theme === 'dark' ? '#4e4e4e' : '#e5e5e5'};
    border-top: 3px solid ${colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  const statusText = document.createElement('div');
  statusText.id = 'loading-status-text';
  statusText.textContent = window.t('deletingInProgress') || '삭제 중입니다...';
  statusText.style.cssText = `
    font-size: 16px;
    color: ${colors.text};
    margin-bottom: 15px;
    font-weight: 500;
  `;

  const progressContainer = document.createElement('div');
  progressContainer.style.cssText = `
    width: 100%;
    height: 6px;
    background: ${theme === 'dark' ? '#4e4e4e' : '#e5e5e5'};
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 10px;
  `;

  const progressBar = document.createElement('div');
  progressBar.id = 'loading-progress-bar';
  progressBar.style.cssText = `
    height: 100%;
    background: ${colors.primary};
    border-radius: 3px;
    width: 0%;
    transition: width 0.3s ease;
  `;

  const progressText = document.createElement('div');
  progressText.id = 'loading-progress-text';
  progressText.textContent = '0%';
  progressText.style.cssText = `
    font-size: 14px;
    color: ${colors.text};
    opacity: 0.8;
  `;

  progressContainer.appendChild(progressBar);
  loadingContainer.appendChild(spinner);
  loadingContainer.appendChild(statusText);
  loadingContainer.appendChild(progressContainer);
  loadingContainer.appendChild(progressText);
  overlay.appendChild(loadingContainer);

  return overlay;
}

function showLoadingOverlay() {
  const existingOverlay = document.getElementById('chat-delete-loading-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = createLoadingOverlay();
  document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('chat-delete-loading-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function updateLoadingProgress(progress, current, total) {
  const progressBar = document.getElementById('loading-progress-bar');
  const progressText = document.getElementById('loading-progress-text');
  const statusText = document.getElementById('loading-status-text');

  if (progressBar && progressText && statusText) {
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;

    if (current && total) {
      statusText.textContent = window.t('deletingProgress')?.replace('{current}', current).replace('{total}', total) ||
        `삭제 중... (${current}/${total})`;
    }
  }
}

function createCustomModal(message, onConfirm, onCancel) {
  const colors = getThemeColors();
  const theme = getCurrentTheme();

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: ${theme === 'dark' ? '#2f2f2f' : '#f9f9f9'};
    border: ${theme === 'dark' ? 'none' : `1px solid ${colors.borderLight}`};
    border-radius: 8px;
    padding: 20px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;

  const messageEl = document.createElement('div');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    margin-bottom: 20px;
    font-size: 16px;
    color: ${colors.text};
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: center;
  `;

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = onCancel === null ? window.t('confirm') : window.t('delete');
  confirmBtn.style.cssText = `
    padding: 6px 12px;
    border: none;
    background: ${onCancel === null ? 'transparent' : '#dc3545'};
    color: ${onCancel === null ? colors.text : 'white'};
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    ${onCancel === null ? `border: 1px solid ${theme === 'dark' ? '#4e4e4e' : '#d0d0d0'};` : ''}
    transition: all 0.2s ease;
  `;

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = window.t('cancel');
  cancelBtn.style.cssText = `
    padding: 6px 12px;
    border: 1px solid ${theme === 'dark' ? '#4e4e4e' : '#d0d0d0'};
    background: transparent;
    color: ${colors.text};
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  `;

  const addButtonEffects = (btn, isConfirm = false) => {
    const hoverBg = isConfirm ? '#c82333' : (theme === 'dark' ? '#424242' : '#ececec');
    const normalBg = isConfirm ? '#dc3545' : 'transparent';
    const borderColor = theme === 'dark' ? '#4e4e4e' : '#d0d0d0';

    ['focus', 'mouseenter'].forEach(event => {
      btn.addEventListener(event, () => {
        btn.style.background = hoverBg;
        if (!isConfirm) btn.style.borderColor = theme === 'dark' ? '#4e4e4e' : '#cccccc';
      });
    });

    ['blur', 'mouseleave'].forEach(event => {
      btn.addEventListener(event, () => {
        if (document.activeElement !== btn) {
          btn.style.background = normalBg;
          if (!isConfirm) btn.style.borderColor = borderColor;
        }
      });
    });
  };

  addButtonEffects(confirmBtn, onCancel !== null);
  addButtonEffects(cancelBtn);

  buttonContainer.appendChild(confirmBtn);

  if (onCancel !== null) {
    buttonContainer.insertBefore(cancelBtn, confirmBtn);
  }

  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    if (onCancel) onCancel();
  });

  confirmBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    if (onConfirm) onConfirm();
  });

  modalContent.appendChild(messageEl);
  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal);
      if (onCancel) onCancel();
    }
  });
}

function createChatDeleteButton() {
  const colors = getThemeColors();

  const button = document.createElement('button');
  button.id = 'chat-delete-btn';
  button.textContent = window.t('chatDelete');
  button.style.cssText = `
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  `;

  ['focus', 'mouseenter'].forEach(event => {
    button.addEventListener(event, () => {
      button.style.background = '#0d8a6f';
    });
  });

  ['blur', 'mouseleave'].forEach(event => {
    button.addEventListener(event, () => {
      if (document.activeElement !== button) {
        button.style.background = colors.primary;
      }
    });
  });

  button.addEventListener('click', () => {
    showActionButtons();
    addCheckboxes();
  });

  return button;
}

function showActionButtons() {
  const colors = getThemeColors();
  const theme = getCurrentTheme();
  const buttonContainer = document.getElementById('chat-delete-btn-container');

  if (buttonContainer) {
    buttonContainer.innerHTML = '';

    const heartLink = document.createElement('a');
    heartLink.href = 'https://github.com/sponsors/RAON28';
    heartLink.target = '_blank';
    heartLink.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #e53e3e;
      padding: 4px;
      border-radius: 4px;
      margin-right: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
      background: transparent;
      border: 1px solid transparent;
    `;

    heartLink.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 16 16" style="fill: currentColor;">
        <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002Z"></path>
      </svg>
    `;

    heartLink.addEventListener('mouseenter', () => {
      heartLink.style.color = '#c53030';
      heartLink.style.transform = 'scale(1.1)';
      heartLink.style.background = theme === 'dark' ? '#424242' : '#f0f0f0';
      heartLink.style.borderColor = theme === 'dark' ? '#4e4e4e' : '#d0d0d0';
    });

    heartLink.addEventListener('mouseleave', () => {
      heartLink.style.color = '#e53e3e';
      heartLink.style.transform = 'scale(1)';
      heartLink.style.background = 'transparent';
      heartLink.style.borderColor = 'transparent';
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = window.t('cancel');
    cancelBtn.style.cssText = `
      background: transparent;
      color: ${colors.text};
      border: 1px solid ${colors.borderLight};
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      margin-right: 8px;
      transition: all 0.2s ease;
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = window.t('delete');
    deleteBtn.style.cssText = `
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    `;

    const addButtonEffects = (btn, isDelete = false) => {
      const hoverBg = isDelete ? '#c82333' : (theme === 'dark' ? '#424242' : '#ececec');
      const normalBg = isDelete ? '#dc3545' : 'transparent';
      const borderColor = theme === 'dark' ? '#4e4e4e' : '#d0d0d0';

      ['focus', 'mouseenter'].forEach(event => {
        btn.addEventListener(event, () => {
          btn.style.background = hoverBg;
          if (!isDelete) btn.style.borderColor = theme === 'dark' ? '#4e4e4e' : '#cccccc';
        });
      });

      ['blur', 'mouseleave'].forEach(event => {
        btn.addEventListener(event, () => {
          if (document.activeElement !== btn) {
            btn.style.background = normalBg;
            if (!isDelete) btn.style.borderColor = borderColor;
          }
        });
      });
    };

    addButtonEffects(cancelBtn);
    addButtonEffects(deleteBtn, true);

    cancelBtn.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll('.conversation-checkbox');
      checkboxes.forEach(checkbox => {
        if (checkbox.parentNode) {
          checkbox.parentNode.removeChild(checkbox);
        }
      });

      const selectAllContainer = document.querySelector('.select-all-container');
      if (selectAllContainer && selectAllContainer.parentNode) {
        selectAllContainer.parentNode.removeChild(selectAllContainer);
      }

      const selectAllCheckbox = document.getElementById('select-all-checkbox');
      if (selectAllCheckbox && selectAllCheckbox.parentNode) {
        selectAllCheckbox.parentNode.removeChild(selectAllCheckbox);
      }

      restoreChatLinks();

      showChatDeleteButton();
    });

    deleteBtn.addEventListener('click', () => {
      const selectedCheckboxes = document.querySelectorAll('.conversation-checkbox:checked');
      if (selectedCheckboxes.length === 0) {
        createCustomModal(window.t('noChatsSelected'), () => {
        }, null);
        return;
      }

      createCustomModal(window.t('confirmDelete'), () => {
        showLoadingOverlay();

        const executeDelete = () => {
          if (window.deleteMultipleChats) {
            window.deleteMultipleChats();
          } else {
            setTimeout(executeDelete, 1000);
          }
        };

        executeDelete();
      }, () => {
      });
    });

    buttonContainer.appendChild(heartLink);
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(deleteBtn);
  }
}

function showChatDeleteButton() {
  const buttonContainer = document.getElementById('chat-delete-btn-container');
  if (buttonContainer) {
    buttonContainer.innerHTML = '';
    const button = createChatDeleteButton();
    buttonContainer.appendChild(button);
  }
}

function restoreChatLinks() {
  const conversations = document.querySelectorAll('a[href^="/c/"]');
  conversations.forEach(conversation => {
    const link = conversation.querySelector("a");
    if (link && link.style) {
      link.style.pointerEvents = "auto";
      link.style.cursor = "pointer";
    }

    if (conversation.removeEventListener) {
      conversation.removeEventListener("click", conversation._clickHandler);
    }

    if (conversation.style) {
      conversation.style.cursor = "default";
    }
  });
}

window.showChatDeleteButton = showChatDeleteButton;
window.removeAllCheckboxesFromAddCheckboxes = removeAllCheckboxes;
window.restoreChatLinks = restoreChatLinks;
window.showLoadingOverlay = showLoadingOverlay;
window.hideLoadingOverlay = hideLoadingOverlay;
window.updateLoadingProgress = updateLoadingProgress;

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function addCheckboxes() {
  if (!document || !document.querySelectorAll) {
    return;
  }

  let conversations = null;
  try {
    conversations = document.querySelectorAll('a[href^="/c/"]');
  } catch (error) {
    return;
  }

  if (!conversations || conversations.length === 0) {
    return;
  }

  const colors = getThemeColors();

  conversations.forEach((conversation, index) => {
    if (!conversation || !conversation.querySelector || !conversation.appendChild) {
      return;
    }

    let existingCheckbox = null;
    try {
      existingCheckbox = conversation.querySelector('.conversation-checkbox');
    } catch (error) {
      return;
    }

    let isChecked = existingCheckbox ? existingCheckbox.checked : false;
    if (existingCheckbox) {
      existingCheckbox.remove();
    }

    const flexContainer = document.createElement("div");
    flexContainer.style.cssText = `
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0;
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "conversation-checkbox";
    checkbox.dataset.index = index;
    checkbox.style.cssText = `
      margin-right: 8px;
      margin-left: 4px;
      position: relative;
      top: 1px;
      accent-color: ${colors.primary};
      filter: ${getCurrentTheme() === 'dark' ? 'invert(1)' : 'none'};
    `;
    checkbox.checked = isChecked;

    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
      const clickedCheckbox = event.target;
      checkPreviousCheckboxes(clickedCheckbox);
      window.lastCheckedCheckbox = clickedCheckbox;
      updateSelectAllCheckbox();
    });

    flexContainer.appendChild(checkbox);

    while (conversation.firstChild) {
      flexContainer.appendChild(conversation.firstChild);
    }

    conversation.appendChild(flexContainer);

    let link = null;
    try {
      link = conversation.querySelector("a");
    } catch (error) {
    }

    if (link && link.style) {
      link.style.pointerEvents = "none";
      link.style.cursor = "default";
    }

    if (conversation.addEventListener && conversation.style) {
      const clickHandler = (event) => {
        if (!event.target.classList.contains('conversation-checkbox')) {
          toggleCheckboxInConversation(conversation, event);
        }
      };

      conversation.addEventListener("click", clickHandler);
      conversation._clickHandler = clickHandler; 

      conversation.style.cursor = "pointer";
    }
  });

  addSelectAllCheckbox();
  addShiftKeyEventListeners();
}

function toggleCheckboxInConversation(conversation, event) {
  event.preventDefault();
  event.stopPropagation();

  if (!conversation || !conversation.querySelector) {
    return;
  }

  const checkbox = conversation.querySelector('.conversation-checkbox');
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    checkPreviousCheckboxes(checkbox);
    if (checkbox.checked) {
      window.lastCheckedCheckbox = checkbox;
    }
    updateSelectAllCheckbox();
  }
}

function checkPreviousCheckboxes(clickedCheckbox) {
  if (!clickedCheckbox) {
    return;
  }

  if (window.shiftPressed && window.lastCheckedCheckbox) {
    const allCheckboxes = Array.from(
      document.querySelectorAll('.conversation-checkbox')
    );
    const start = allCheckboxes.indexOf(window.lastCheckedCheckbox);
    const end = allCheckboxes.indexOf(clickedCheckbox);

    if (start === -1 || end === -1) {
      return;
    }

    const [lower, upper] = start < end ? [start, end] : [end, start];

    for (let i = lower; i <= upper; i++) {
      if (allCheckboxes[i]) {
        allCheckboxes[i].checked = true;
      }
    }
  }
}

function addShiftKeyEventListeners() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Shift") {
      window.shiftPressed = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Shift") {
      window.shiftPressed = false;
    }
  });
}

function addSelectAllCheckbox() {
  if (!document || !document.querySelector) {
    return;
  }

  let historyContainer = null;
  try {
    historyContainer = document.querySelector('[id^="history"]');
  } catch (error) {
    return;
  }

  if (!historyContainer) {
    return;
  }

  if (historyContainer.querySelector('.select-all-container')) {
    return;
  }

  const colors = getThemeColors();

  const selectAllContainer = document.createElement('div');
  selectAllContainer.className = 'select-all-container';
  selectAllContainer.style.cssText = `
    padding: 8px 12px;
    border-bottom: 1px solid ${colors.borderLight};
    display: flex;
    align-items: center;
    margin-left: 8px;
  `;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'select-all-checkbox';
  checkbox.style.cssText = `
    margin-right: 8px;
    accent-color: ${colors.primary};
    filter: ${getCurrentTheme() === 'dark' ? 'invert(1)' : 'none'};
  `;

  const label = document.createElement('span');
  label.textContent = window.t('selectAll');
  label.style.cssText = `
    color: ${colors.text};
    font-size: 14px;
    font-weight: 500;
  `;

  checkbox.addEventListener('change', (e) => {
    const allCheckboxes = document.querySelectorAll('.conversation-checkbox');
    allCheckboxes.forEach(cb => {
      cb.checked = e.target.checked;
    });
  });

  selectAllContainer.appendChild(checkbox);
  selectAllContainer.appendChild(label);

  const chatLabel = historyContainer.querySelector('h2');
  if (chatLabel && chatLabel.parentElement) {
    chatLabel.parentElement.insertBefore(selectAllContainer, chatLabel.nextSibling);
  }
}

function updateSelectAllCheckbox() {
  const allCheckboxes = document.querySelectorAll('.conversation-checkbox');
  const checkedCheckboxes = document.querySelectorAll('.conversation-checkbox:checked');
  const selectAllCheckbox = document.getElementById('select-all-checkbox');

  if (selectAllCheckbox && allCheckboxes.length > 0) {
    if (checkedCheckboxes.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }
}

function removeAllCheckboxes() {
  if (!document || !document.querySelectorAll) {
    return;
  }

  let checkboxes = null;
  try {
    checkboxes = document.querySelectorAll('.conversation-checkbox');
  } catch (error) {
    return;
  }

  if (checkboxes) {
    checkboxes.forEach(checkbox => {
      if (checkbox && checkbox.parentNode) {
        checkbox.parentNode.removeChild(checkbox);
      }
    });
  }

  let conversations = null;
  try {
    conversations = document.querySelectorAll('a[href^="/c/"]');
  } catch (error) {
    return;
  }

  conversations.forEach(conversation => {
    if (!conversation || !conversation.querySelector) {
      return;
    }

    const flexContainer = conversation.querySelector('div[style*="display: flex"][style*="align-items: center"]');
    if (flexContainer) {
      const originalContent = flexContainer.querySelector('.flex.min-w-0.grow.items-center.gap-2\.5');
      const trailingContent = flexContainer.querySelector('.trailing.highlight.text-token-text-tertiary');

      conversation.innerHTML = '';
      if (originalContent) {
        conversation.appendChild(originalContent);
      }
      if (trailingContent) {
        conversation.appendChild(trailingContent);
      }
    }
  });

  const selectAllContainer = document.querySelector('.select-all-container');
  if (selectAllContainer && selectAllContainer.parentNode) {
    selectAllContainer.parentNode.removeChild(selectAllContainer);
  }
}

function addChatDeleteButton() {
  if (!document || !document.getElementById || !document.querySelector) {
    return;
  }

  if (document.getElementById('chat-delete-btn-container')) return;

  let chatLabel = null;
  try {
    chatLabel = document.querySelector('h2.__menu-label');
  } catch (error) {
    setTimeout(addChatDeleteButton, 2000);
    return;
  }

  if (!chatLabel) {
    setTimeout(addChatDeleteButton, 2000);
    return;
  }

  chatLabel.style.display = 'flex';
  chatLabel.style.flexDirection = 'row';
  chatLabel.style.alignItems = 'center';
  chatLabel.style.justifyContent = 'space-between';

  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'chat-delete-btn-container';
  buttonContainer.style.marginLeft = 'auto';
  buttonContainer.style.marginRight = '8px';

  const button = createChatDeleteButton();
  buttonContainer.appendChild(button);

  chatLabel.appendChild(buttonContainer);
}

function updateThemeColors() {
  if (!document || !document.querySelectorAll || !document.getElementById) {
    return;
  }

  const colors = getThemeColors();
  const chatDeleteBtn = document.getElementById('chat-delete-btn');

  if (chatDeleteBtn && chatDeleteBtn.style) {
    chatDeleteBtn.style.background = colors.primary;
  }

  let checkboxes = null;
  try {
    checkboxes = document.querySelectorAll('.conversation-checkbox');
  } catch (error) {
    return;
  }

  if (checkboxes) {
    checkboxes.forEach(checkbox => {
      if (checkbox && checkbox.style) {
        checkbox.style.accentColor = colors.primary;
        checkbox.style.filter = getCurrentTheme() === 'dark' ? 'invert(1)' : 'none';
      }
    });
  }

  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (selectAllCheckbox && selectAllCheckbox.style) {
    selectAllCheckbox.style.accentColor = colors.primary;
    selectAllCheckbox.style.filter = getCurrentTheme() === 'dark' ? 'invert(1)' : 'none';
  }
}

const debouncedUpdateThemeColors = debounce(updateThemeColors, 100);

const observer = new MutationObserver(() => {
  debouncedUpdateThemeColors();
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
});

function initializeButton() {
  addChatDeleteButton();

  setTimeout(() => {
    if (!document.getElementById('chat-delete-btn-container')) {
      addChatDeleteButton();
    }
  }, 3000);
}

setTimeout(initializeButton, 1000);