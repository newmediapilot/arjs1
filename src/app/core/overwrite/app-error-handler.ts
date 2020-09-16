import {ErrorHandler} from '@angular/core';

export class AppErrorHandler extends ErrorHandler {

  constructor() {
    super();
  }

  handleError(error: any): void {
    console.log('AppErrorHandler', error);
    // super.handleError(error);
  }

}
