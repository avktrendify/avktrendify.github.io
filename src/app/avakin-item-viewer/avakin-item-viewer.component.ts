import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AvakinItem } from '../avakinitem';

@Component({
  selector: 'app-avakin-item-viewer',
  templateUrl: './avakin-item-viewer.component.html',
  styleUrls: ['./avakin-item-viewer.component.css']
})
export class AvakinItemViewerComponent {

  @Input() showTitle!: boolean;
  @Input() isSpanish: boolean;
  @Input() showRemoveButton!: boolean;

  @Input() item!: AvakinItem;

  @Output() removeButtonClicked = new EventEmitter<boolean>();

  constructor() {
    this.isSpanish = true;
  }

  removeButtonClick(): void {
    this.removeButtonClicked.emit(true);
  }
}
