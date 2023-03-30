export const phoneTransformer = {
  normalize(p: string): string {
    p = p.replace(/\D/g,'').trim();
    if (p.startsWith('375')) {
      p = p.substring(3);
    }
    if (p.length > 9) {
      p = p.substring(0, 9)
    }
    return p;
  },

  toBelarusFormat(p: string): string {
    const parts = p.trim().replace(/\D/g,'')
      .match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);

    let result = '+375'
    if (!parts || parts.length < 2) {
      return result;
    }
    if (parts[1]) result += ' (' + parts[1];
    if (parts[2]) result += ') ' + parts[2]
    if (parts[3]) result += '-' + parts[3];
    if (parts[4]) result += '-' + parts[4];
    return result;
  }
}
