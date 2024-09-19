var gdjs;
(function(gdjs2) {
  gdjs2.PixiFiltersTools.registerFilterCreator("Glow", {
    makePIXIFilter: function(layer, effectData) {
      const glowFilter = new PIXI.filters.GlowFilter();
      return glowFilter;
    },
    update: function(filter, layer) {
    },
    updateDoubleParameter: function(filter, parameterName, value) {
      const glowFilter = filter;
      if (parameterName === "innerStrength") {
        glowFilter.innerStrength = value;
      } else if (parameterName === "outerStrength") {
        glowFilter.outerStrength = value;
      } else if (parameterName === "distance") {
        glowFilter.distance = value;
      }
    },
    updateStringParameter: function(filter, parameterName, value) {
      const glowFilter = filter;
      if (parameterName === "color") {
        glowFilter.color = gdjs2.PixiFiltersTools.rgbOrHexToHexNumber(value);
      }
    },
    updateBooleanParameter: function(filter, parameterName, value) {
    }
  });
})(gdjs || (gdjs = {}));
//# sourceMappingURL=glow-pixi-filter.js.map
