import {ToastAndroid} from 'react-native';

class ToastLog {
  text = '';

  textHide = '';

  log(string, duration) {
    if (this.text.length === 0) {
      this.text = `---> ${string}`;
    } else {
      this.text += `\n\n---> ${string}`;
    }

    if (window.toastMessage) {
      ToastAndroid.show(this.text, duration || ToastAndroid.LONG);
    }
  }

  logHide(string, duration) {
    if (this.text.length === 0) {
      this.text = `---> ${string}`;
    } else {
      this.text += `\n\n---> ${string}`;
    }

    if (this.textHide.length === 0) {
      this.textHide = `---> ${string}`;
    } else {
      this.textHide += `\n\n---> ${string}`;
    }

    ToastAndroid.showWithGravity(
      this.textHide,
      duration || ToastAndroid.LONG,
      ToastAndroid.TOP,
    );
  }

  reset() {
    this.text = '';
  }

  resetHide() {
    this.textHide = '';
  }

  get() {
    return this.text;
  }
}

const toastLog = new ToastLog();

export default toastLog;
