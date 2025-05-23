import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileToUrl'
})
export class FileToUrlPipe implements PipeTransform {
  transform(file: File | null): string | null {
    if (!file) return null;
    return URL.createObjectURL(file);
  }
}