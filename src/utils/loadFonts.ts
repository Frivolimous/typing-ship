import * as WebFont from 'webfontloader';

export function loadFonts(fonts: string[]): Promise<void> {
  console.log('loading font', fonts);
  // specifically loads GOOGLE fonts through WebFont with a simple interface.
  // Can extend this to cover other platforms but why bother?
  return new Promise(resolve => {
    WebFont.load({
      google: {
        families: fonts,
      },
      active: () => (console.log('active'), resolve()),
      inactive: () => (console.log('inactive'), resolve()),
    });
  });
}
