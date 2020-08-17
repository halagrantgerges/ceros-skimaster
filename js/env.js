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
    };

    this.loadedAssets = {};

    this.obstacleTypes = ["tree", "treeCluster", "rock1", "rock2"];

    this.obstacles = [];
  }



}
