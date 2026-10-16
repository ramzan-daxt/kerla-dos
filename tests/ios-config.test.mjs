import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('iOS uses a separate identity and bundled export, not a dev server',()=>{
  const config=JSON.parse(readFileSync(new URL('../capacitor.config.json',import.meta.url)));
  assert.equal(config.appId,'com.kerlados.app');
  assert.equal(config.webDir,'out');
  assert.equal(config.ios.backgroundColor,'#f5efe3');
  assert.equal(config.ios.contentInset,'never');
  assert.equal(config.server,undefined);
  const project=readFileSync(new URL('../ios/App/App.xcodeproj/project.pbxproj',import.meta.url),'utf8');
  assert.ok(project.includes('PRODUCT_BUNDLE_IDENTIFIER = com.kerlados.app;'));
  assert.ok(project.includes('TARGETED_DEVICE_FAMILY = "1,2"'));
  const scripts=JSON.parse(readFileSync(new URL('../package.json',import.meta.url))).scripts;
  assert.equal(scripts['ios:sync'],'next build --webpack && cap sync ios');
});
