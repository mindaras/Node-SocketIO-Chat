class Users {
  constructor() {
    this.users = [];
  };
  addUser(id, displayName, room) {
    var user = { id, displayName, room };
    user.displayName = user.displayName[0].toUpperCase() + user.displayName.slice(1);
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    var user = this.users.find(user => user.id === id);
    this.users = this.users.filter(user => user.id !== id);
    return user;
  }
  getUser(id) {
    return this.users.find(user => user.id === id);
  }
  getUserList(room) {
    var users = this.users.filter(user => user.room === room);
    return users.map(user => user.displayName);
  }
}

module.exports = { Users };
