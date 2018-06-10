const expect = require('expect'),
      { Users } = require('./Users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: 1,
        displayName: 'John',
        room: 'Test 1'
      },
      {
        id: 2,
        displayName: 'Lisa',
        room: 'Test 2'
      },
      {
        id: 3,
        displayName: 'Mike',
        room: 'Test 1'
      }
    ];
  });

  it('should add new user', () => {
    var users = new Users(),
        user = {
          id: 1,
          displayName: 'John',
          room: 'Test'
        };

    users.addUser(user.id, user.displayName, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var res = users.removeUser(2);
    expect(res.id).toBe(2);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    users.removeUser(4);
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var res = users.getUser(2);
    expect(res).toEqual(users.users[1]);
  });

  it('should not find user', () => {
    var res = users.getUser(4);
    expect(res).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should return names for Test 1 room', () => {
    var res = users.getUserList('Test 1');
    expect(res).toEqual([users.users[0].displayName, users.users[2].displayName]);
  });

  it('should return names for Test 2 room', () => {
    var res = users.getUserList('Test 2');
    expect(res).toEqual([users.users[1].displayName]);
  });
});
