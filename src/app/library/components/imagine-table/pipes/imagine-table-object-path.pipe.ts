import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'imagineTableObjectPath',
})
export class ImagineTableObjectPathPipe implements PipeTransform {
  transform(value: string, objectValue: any) {
    value = value.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    value = value.replace(/^\./, ''); // strip a leading dot
    const array = value.split('.');
    for (let i = 0, n = array.length; i < n; ++i) {
      const k = array[i];
      if (k in objectValue) {
        objectValue = objectValue[k];
      } else {
        return;
      }
    }
    return objectValue;
  }
}
