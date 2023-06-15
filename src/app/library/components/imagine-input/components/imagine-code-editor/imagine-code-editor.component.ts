import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'imagine-code-editor',
  templateUrl: './imagine-code-editor.component.html',
  styleUrls: ['./imagine-code-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagineCodeEditorComponent),
      multi: true,
    },
  ],
})
export class ImagineCodeEditorComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  /**Access to native input element */
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLElement>;
  /**Sets input value */
  @Input() value = '';
  /**Tells parent when value changes */
  @Output() valueChange = new EventEmitter();
  /**Sends parent on input event */
  @Output() input = new EventEmitter();
  private defaultInnerHTML = '<div>&nbsp;</div>';

  lastCaretPosition = 0;

  /**autocomplete box top, left */
  autocompleteConfig = {
    width: '',
    x: 0,
    y: 0,
    show: false,
  };

  private tab = '    ';
  private valueToSet = '';

  /**autocomplete variables list */
  @Input() variablesList: any[] = [];
  /**variable key to access its value*/
  @Input() variableValueKey: string = '';
  /**variable key to access its label*/
  @Input() variableLabelKey: string = '';
  lastRange?: Range;

  constructor() {}

  /**
   * input target used on input event (chip type)
   */
  get inputTarget() {
    return { target: { ...this.inputElement, value: this.inputElement.nativeElement.textContent } };
  }

  /**
   * Methods of value accessor interface
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    //not implemented
  };
  onTouch: any = () => {
    //not implemented
  };
  writeValue(value: string): void {
    if (!this.inputElement) {
      this.valueToSet = value;
    }
    if (this.inputElement && value && this.value !== value) {
      value = value
        .split('\n')
        .map((part) => `<div>${part}</div>`)
        .join('');
      console.log(value);
      this.inputElement.nativeElement.innerHTML = value;
      this.js(this.inputElement.nativeElement);
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  ngOnInit(): void {
    // Syntax highlight for JS
    // Turn div into an editor
    console.log(this.variablesList);
  }

  ngAfterViewInit(): void {
    this.inputElement.nativeElement.focus();
    this.editor(this.inputElement.nativeElement);
    if (this.valueToSet) {
      this.writeValue(this.valueToSet);
    }
  }

  editor = (el: any, highlight = this.js) => {
    highlight(el);

    el.addEventListener('keydown', (e: KeyboardEvent) => {
      console.log(e);
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    });

    el.addEventListener('keyup', (e: KeyboardEvent) => {
      const pos = this.caret();
      const value = this.inputElement.nativeElement.textContent;
      if (e.key === 'Enter' || e.key.includes('Arrow')) {
        if (e.key === 'Enter' && value) {
          this.setTab();
        }
        return;
      }

      highlight(el);
      this.setCaret(pos);
    });
  };

  caret = () => {
    const range = window.getSelection()!.getRangeAt(0);
    const prefix = range.cloneRange();
    prefix.selectNodeContents(this.inputElement.nativeElement);
    prefix.setEnd(range.endContainer, range.endOffset);
    return prefix.toString().length;
  };

  setCaret = (pos: number, parent = this.inputElement.nativeElement as any) => {
    for (const node of parent.childNodes) {
      if (node.nodeType == Node.TEXT_NODE) {
        if (node.length >= pos) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.setStart(node, pos);
          range.collapse(true);
          sel!.removeAllRanges();
          sel!.addRange(range);
          return -1;
        } else {
          pos = pos - node.length;
        }
      } else {
        pos = this.setCaret(pos, node);
        if (pos < 0) {
          return pos;
        }
      }
    }
    return pos;
  };

  /**
   * Executes on input
   * @param event input event
   */
  onInput(event: any) {
    this.onTouch();
    if (!this.inputElement.nativeElement.innerHTML) {
      this.inputElement.nativeElement.innerHTML = this.defaultInnerHTML;
    }
    this.variableFormat(event);
    this.value = event.target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.input.emit(event);
  }

  setTab(): void {
    const pos = this.caret() + this.tab.length;
    const range = window.getSelection()!.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(this.tab));
    this.js(this.inputElement.nativeElement);
    this.setCaret(pos);
  }

  js = (el: any) => {
    if (!el.children.length) {
      this.highlightNode(el);
    }
    for (const node of el.children) {
      this.highlightNode(node);
    }
  };

  highlightNode = (node: any) => {
    const s = node.innerText.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|new|if|else|do|while|switch|for|in|of|continue|break|return|typeof|function|var|const|let|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|[a-zA-Z]/g,
      (match: any) => {
        // class to be applied inside pre tag
        let themeClass = 'number';
        let id = '';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            themeClass = 'key';
            id = 'attribute-json-' + match.replace(/"|:/g, '');
          } else {
            themeClass = 'string';
          }
        } else if (
          /true|false|new|if|else|do|while|switch|for|in|of|continue|break|return|typeof|function|var|const|let/.test(
            match
          )
        ) {
          themeClass = 'boolean';
        } else if (/null/.test(match)) {
          themeClass = 'null';
        } else {
          themeClass = 'key';
        }
        return `<span id="${id}" class="${themeClass}">${match}</span>`;
      }
    );
    node.innerHTML = s.split('\n').join('<br/>');
  };

  /**variable format */
  variableFormat(event: any) {
    if (!event.target.value) {
      return;
    }
    let caretPosition = this.caret();
    this.lastCaretPosition = caretPosition;
    const value = event.target.value.split('');
    if (
      (value[caretPosition - 1] &&
        value[caretPosition - 1].includes('{') &&
        value[caretPosition] &&
        value[caretPosition].includes('{')) ||
      (value[caretPosition - 1] &&
        value[caretPosition - 1].includes('{') &&
        value[caretPosition - 2] &&
        value[caretPosition - 2].includes('{'))
    ) {
      const selection = window.getSelection(),
        range = selection!.getRangeAt(0),
        rect = range.getClientRects()[0];
      this.lastRange = range;

      this.autocompleteConfig.width = 300 + 'px';
      this.autocompleteConfig.x = rect.x;
      this.autocompleteConfig.y = rect.y;
      this.autocompleteConfig.show = true;
    } else {
      this.autocompleteConfig.show = false;
    }
  }

  insertText(option: string) {
    if (this.lastRange) {
      this.lastRange.startContainer.textContent = this.lastRange.startContainer.textContent + `${option}}}`;
      this.autocompleteConfig.show = false;
    }
  }
}
