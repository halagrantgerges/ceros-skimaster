class EnvironmentAssets {
  assets;
  loadedAssets;
  obstacleTypes;
  obstacles;

  constructor() {
    this.assets = {
      skierCrash: "img/skier_crash.png",
      skierLeft: "img/skier_left.png",
      skierLeftDown: "img/skier_left_down.png",
      skierDown: "img/skier_down.png",
      skierRightDown: "img/skier_right_down.png",
      skierRight: "img/skier_right.png",
      tree: "img/tree_1.png",
      treeCluster: "img/tree_cluster.png",
      rock1: "img/rock_1.png",
      rock2: "img/rock_2.png",
      skierJump1: "img/skier_jump_1.png",
      skierJump2: "img/skier_jump_2.png",
      skierJump3: "img/skier_jump_3.png",
      skierJump4: "img/skier_jump_4.png",
      skierJump5: "img/skier_jump_5.png",
      rhinoDef: "img/rhino_default.png",
      rhinoAteMe1: "img/rhino_lift.png",
      rhinoAteMe2: "img/rhino_lift_eat_1.png",
      rhinoAteMe3: "img/rhino_lift_eat_2.png",
      rhinoAteMe4: "img/rhino_lift_eat_3.png",
      rhinoAteMe5: "img/rhino_lift_eat_4.png",
      rhinoAteMe6: "img/rhino_lift_mouth_open.png",
      rhinoAteMe7: "img/rhino_run_left.png",
      rhinoAteMe8: "img/rhino_run_left_2.png",

    };

    this.loadedAssets = {};

    this.obstacleTypes = ["tree", "treeCluster", "rock1", "rock2"];

    this.obstacles = [];
  }

  loadAssets = function () {
    var assetPromises = [];
    var localAssets = this.loadedAssets;

    _.each(this.assets, function (asset, assetName) {
      var assetImage = new Image();
      var assetDeferred = new $.Deferred();

      assetImage.onload = function () {
        assetImage.width /= 2;
        assetImage.height /= 2;
        localAssets[assetName] = assetImage;

        assetDeferred.resolve();
      };
      assetImage.src = asset;

      assetPromises.push(assetDeferred.promise());
    });

    return $.when.apply($, assetPromises);
  };

}
