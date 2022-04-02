class EventBus{
  events: Record<string, any> = {}

  emit(eventName: string, data: any) {
      if (this.events[eventName]) {
          this.events[eventName].forEach(function(fn: any) {
              fn(data);
          });
      }
  }
  on(eventName: string, fn: any) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
  }

  off(eventName: string, fn: any) {
      if (this.events[eventName]) {
          for (var i = 0; i < this.events[eventName].length; i++) {
              if (this.events[eventName][i] === fn) {
                  this.events[eventName].splice(i, 1);
                  break;
              }
          };
      }
  }
}

export default (new EventBus)