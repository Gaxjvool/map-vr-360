AFRAME.registerComponent('scene-transition', {
  schema: {
    to: {type: 'string'}
  },

  init: function () {
    this.hoverStartTime = 0;
    this.hoverDuration = 2000; // 2 seconds in milliseconds
    this.isHovering = false;

    this.el.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.tick = AFRAME.utils.throttleTick(this.tick.bind(this), 100);
  },

  onMouseEnter: function() {
    this.isHovering = true;
    this.hoverStartTime = performance.now();
    var cur = document.getElementById("cursor-visual");
    cur.emit("startFuse");
  },

  onMouseLeave: function() {
    this.isHovering = false;
    var cur = document.getElementById("cursor-visual");
    cur.emit("stopFuse");

  },

  tick: function() {
    if (this.isHovering && performance.now() - this.hoverStartTime > this.hoverDuration) {
      this.isHovering = false; // Reset hovering state
      this.startTransition()
    }
  },

  startTransition: function() {
    var cam=document.getElementById("cam");
    cam.emit("zoomin");
        var fp=document.getElementById("transition-plane");
        fp.emit("fadeIn");

    this.switchScene()
  },
  
  switchScene: function() {
    var toScene = this.data.to
    setTimeout(function () {
      const event = new CustomEvent('sceneChanged', { detail: { to: toScene } });
      document.dispatchEvent(event);
      var fp=document.getElementById("transition-plane");
      fp.emit("fadeOut");
      var cam=document.getElementById("cam");
      cam.emit("zoomout");
    },600);
  }
});

AFRAME.registerComponent('billboard', {
  tick: function () {
    var camera = this.el.sceneEl.camera;
    if (!camera) {
      console.log("no camera detected");
      return
    }
    
    var pos = new THREE.Vector3();
    var lookAtVector = new THREE.Vector3(0, 0, -1);
    lookAtVector.applyQuaternion(camera.quaternion);
    pos.addVectors(camera.position, lookAtVector);
    this.el.object3D.lookAt(pos);
  }
});

AFRAME.registerComponent('scenelistener',{
  init:function(){
      this.el.sceneEl.addEventListener('renderstart',function(){
          setTimeout(function() {

              //set up bg-music
              var background_music = document.getElementById('background_music');
              if(background_music) {
                  background_music.play().catch(function() {
                      window.addEventListener('click',function(){
                          if (background_music.currentTime==0 && background_music.paused) {
                              try {
                                  background_music.play().catch(function() {});
                              } catch (e) {}
                          }
                      });
                  });
              }
              //set up config for mobile
              if(window.is_mobile) {
                  var scene = document.querySelector('a-scene');
                  scene.enterVR();
              }
          },1000);
      });
      this.el.sceneEl.addEventListener('enter-vr',function(){
          if (AFRAME.utils.device.checkHeadsetConnected()) {
              console.log("AFRAME.utils.device.checkHeadsetConnected()");
              var cursor = document.getElementById("cursor-visual");
              cursor.setAttribute('position','0.02 0 -0.9');
              vr_mode = true;
          }
      });
      this.el.sceneEl.addEventListener('exit-vr',function(){
          var cursor = document.getElementById("cursor-visual");
          cursor.setAttribute('position','0 0 -0.9');
          vr_mode = false;
      });
  }
});