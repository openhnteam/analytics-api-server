export class GlobalVariable {
    private static instance: GlobalVariable;
    private data: any;
  
    private constructor() {
      this.data = {}; // 初始化全局变量
    }
  
    static getInstance(): GlobalVariable {
      if (!GlobalVariable.instance) {
        GlobalVariable.instance = new GlobalVariable();
      }
      return GlobalVariable.instance;
    }
  
    setData(key: string, value: any) {
      this.data[key] = value;
    }
  
    getData(key: string) {
      return this.data[key];
    }
  }
  