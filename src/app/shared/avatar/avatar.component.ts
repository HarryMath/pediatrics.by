import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { colorUtils } from '../utils/Color';

interface AvatarData {
  id?: number,
  display?: string,
  name?: string,
  fullName?: string,
  lastName?: string,
  firstName?: string,
  photoUrl?: string
  avatar?: string
}

@Component({
  standalone: true,
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  color: string = '#ffffff00';
  letter: string = '?';
  hasPhoto: boolean = false;
  photo?: string;
  style = {
    backgroundColor: this.color,
    backgroundImage: this.photo,
    fontSize: '1rem',
    width: '2.5rem',
    height: '2.5rem',
    lineHeight: '2.5rem',
    borderRadius: '50%'
  };

  @Input() set borderRadius(r: string) {
    this.style.borderRadius = r;
  }

  @Input() set size(rem: number) {
    this.style = {
      ...this.style,
      height: rem + 'rem',
      width: rem + 'rem',
      lineHeight: rem + 'rem',
      fontSize: (rem / 2) + 'rem'
    };
  }

  @Input() set data(payload: AvatarData | any) {
    this.photo =
      payload.avatar ? 'url(' + payload.avatar + ')' :
        payload.photoUrl ? 'url(' + payload.photoUrl + ')' : undefined;

    this.hasPhoto = (this.photo?.length || 0) > 10;

    if (payload.id && !this.hasPhoto) {
      const text = (payload.display || payload.name || payload.fullName || payload.lastName || payload.firstName || '?')
        .trim().toUpperCase();
      this.letter = text === '' ? '?' : text.charAt(0);
      const color = colorUtils.generateHSL(payload.id);
      this.color = color.toString();
      this.photo = `linear-gradient(45deg, ${color} 0%, ${color.rotate(20).toString()} 100%)`;
    }
    this.style = {...this.style, backgroundColor: this.color, backgroundImage: this.photo};
  };
}
