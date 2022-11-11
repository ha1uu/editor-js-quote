import "./index.styl"

export default class Quote {
  rootClass = 'editor-js-quote-plugin';
  caption = null;
  text = null;
  image = null;
  post = null;
  headers = {};
  uploadFileName = 'file';
  imageLoading = false;
  endpoint = '/';

  constructor({data, api, config}){
    this.caption = data.caption;
    this.post = data.post;
    this.text = data.text;
    this.image = data.image;
    this.api = api;
    if (config) {
      if (config.headers) {
        this.headers = config.headers;
      }
      if (config.endpoint) {
        this.endpoint = config.endpoint;
      }
      if (config.uploadFileName) {
        this.uploadFileName = config.uploadFileName;
      }
    }
  }

  render(){
    this.root = document.createElement('div');
    this.root.classList.add(this.rootClass);
    this.root.classList.add('cdx-block');
    this.redraw();
    return this.root;
  }

  async handleFileUpload(e) {
    if (e.target.files[0]) {
      let fd = new FormData();
      fd.append(this.uploadFileName, e.target.files[0])

      let data = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: fd
      }).then((res) => res.json());
      return data.file
    }
  }

  redraw() {
    let image = '';
    if (this.image) {
      image = `<div class="${this.rootClass}__image">
        <img src="${this.image}" alt="" />
        <button type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg></button>
      </div>`
    } else {
      image = `<label class="${this.rootClass}__image-input ${this.imageLoading ? 'cdx-loader' : ''}">
        <input type="file" accept="image/*" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
        <span>Загрузить изображение</span>
      </label>`
    }
    let author = `<div class="${this.rootClass}__author">
      <input type="text" class="cdx-input" value="${this.caption || ''}" placeholder="Персона">
      <input type="text" class="cdx-input" value="${this.post || ''}" placeholder="Должность">
    </div>`;
    let header = `<div class="${this.rootClass}__header">${image}${author}</div>`;
    this.root.innerHTML = `${header}<textarea placeholder="Цитата" rows="5" class="cdx-input">${this.text || ''}</textarea>`

    this.api.listeners.on(this.root.querySelector(`.${this.rootClass}__author input:first-child`), 'input', (e) => {
      this.caption = e.target.value;
    }, false);
    this.api.listeners.on(this.root.querySelector(`.${this.rootClass}__author input:last-child`), 'input', (e) => {
      this.post = e.target.value;
    }, false);
    this.api.listeners.on(this.root.querySelector(`.${this.rootClass} textarea`), 'input', (e) => {
      this.text = e.target.value;
    }, false);

    if (this.image) {
      this.api.listeners.on(this.root.querySelector(`.${this.rootClass}__image button`), 'click', () => {
        if (confirm("Вы уверены?")) {
          this.image = null;
          this.redraw();
        }
      }, false);
    } else {
      this.api.listeners.on(this.root.querySelector(`.${this.rootClass}__image-input input`), 'input', (e) => {
        this.imageLoading = true;
        this.handleFileUpload(e).then((file) => {
          this.image = file;
        }).catch((e) => {
          console.error(e.message)
        }).finally(() => {
          this.imageLoading = false;
          this.redraw();
        })
      }, false);
    }
  }

  save(){
    return {
      post: this.post,
      image: this.image,
      caption: this.caption,
      text: this.text,
    };
  }

  static get toolbox() {
    return {
      title: 'Цитата',
      icon: '<svg width="15" height="14" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg"><path d="M13.53 6.185l.027.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.569-1.568l4.838-4.837L6.396 2.23A1.125 1.125 0 1 1 7.986.64l5.52 5.518.025.027zm-5.815 0l.026.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.568-1.568l4.837-4.837L.58 2.23A1.125 1.125 0 0 1 2.171.64L7.69 6.158l.025.027z"></path></svg>'
    };
  }
}