import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  let hasImages = false;
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-travel-card-image';
        hasImages = true;
      } else if (div.innerHTML.trim() === '') {
        div.remove();
      } else {
        div.className = 'cards-travel-card-body';
      }
    });
    ul.append(li);
  });
  if (ul.children.length === 4) ul.classList.add('cards-4');
  if (!hasImages) block.classList.add('no-image');
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
