import '../../@polymer/polymer/polymer-legacy.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="auth-methods-styles">
  <template>
    <style>
    paper-input,
    paper-masked-input {
      max-width: 560px;
    }

    .edit-icon {
      visibility: hidden;
    }

    [hidden] {
      display: none !important;
    }

    .hint-icon {
      color: var(--hint-trigger-color, rgba(0, 0, 0, 0.74));
      transition: color 0.25s ease-in-out;
      @apply --icon-button;
    }

    .hint-icon:hover {
      color: var(--hint-trigger-hover-color, var(--accent-color, rgba(0, 0, 0, 0.88)));
      @apply --icon-button-hover;
    }

    .action-icon {
      /* --api-form-action-* to have consistent styling rules */
      color: var(--api-form-action-icon-color, var(--icon-button-color, rgba(0, 0, 0, 0.74)));
      transition: color 0.2s ease-in-out;
    }

    .action-icon:hover {
      color: var(--api-form-action-icon-hover-color, var(--accent-color, rgba(0, 0, 0, 0.88)));
    }

    .adv-toggle {
      margin-top: 8px;
    }

    .markdown-body,
    .docs-container {
      @apply --arc-font-body1;
      color: var(--inline-documentation-color, rgba(0, 0, 0, 0.87));
      font-size: 13px !important;
    }

    marked-element {
      background-color: var(--inline-documentation-background-color, #FFF3E0);
      padding: 4px;
    }

    .markdown-body p:first-child {
      margin-top: 0;
      padding-top: 0;
    }

    .markdown-body p:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
