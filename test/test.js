'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');

describe('/', ()=>{
  before(()=>{
    passportStub.install(app);
    passportStub.login({user:{name: 'testuser'}});
  });
  after(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('ログイン時はユーザーページへのリンクが含まれる', (done)=>{
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<a class="btn btn-primary" href="\/user">/)
      .expect(200, done);
  });
});

describe('/login', ()=>{
  before(()=>{
    passportStub.install(app);
    passportStub.login({user:{name: 'testuser'}});
  });
  after(()=>{
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('ログインのためのリンクが含まれる', (done)=>{
    request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<a href="\/auth\/slack"/)
      .expect(200, done);
  });

  it('ログイン時はユーザー名が表示される', (done)=>{
    request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200, done);
  });
});

describe('/logout', ()=>{
  it('/にリダイレクトされる', (done)=>{
    request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302, done);
  });
});
