import { compileNgModule } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {

  @Input() imageSrc: string;
  imageUrl: SafeUrl;
  defaultImage: SafeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl('/assets/layout/images/default-image.png');
  @Output() selectImage = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.imageUrl = this.imageSrc ? this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${this.imageSrc}`) : this.defaultImage;
    console.log(this.imageUrl);
  }

  onImageNotFound(e) {
    this.imageUrl = this.defaultImage;
  }

  onSelectIdImage(input: any) {
    const file: File = input.target.files[0];
    // Convert Image to Base64
    const fileReader: FileReader = new FileReader();
    fileReader.onload = this._handleReaderLoaded.bind(this);
    fileReader.readAsDataURL(file);
  }

   _handleReaderLoaded(readerEvt) {
    const base64textString = readerEvt.target.result;
    this.imageUrl = (base64textString) ? base64textString : this.defaultImage;

    console.log(this.imageUrl);

    const resultBase64 = base64textString.substr(base64textString.indexOf(',') + 1);
    this.selectImage.emit(resultBase64);
  }
}
