{ pkgs, ... }: {
  packages = with pkgs; [
    nodejs_22
    pnpm
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    pnpm = {
      enable = true;
      package = pkgs.pnpm;
    };
  };
}
