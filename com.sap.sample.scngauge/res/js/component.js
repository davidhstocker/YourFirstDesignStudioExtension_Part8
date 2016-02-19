sap.designstudio.sdk.Component.subclass("com.sap.sample.scngauge.SCNGauge", function() {

	var me = this;
	//Properties
	me._enableArc = true;
	me._innerRad = 0.0;
	me._outerRad = 0.0;
	me._endAngleDeg = 90.0;
	me._startAngleDeg = -90.0;
	me._paddingTop = 0;
	me._paddingBottom = 0;
	me._paddingLeft = 0;
	me._paddingRight = 0;
	me._offsetLeft = 0;
	me._offsetDown = 0;
	
	//New with Part 6
	me._useMeasures = false;
	me._endAngleDegMax = 90.0;
	me._measureMax = 0;
	me._measureMin = 0;
	me._measureVal = 0;
	
	//Part 7 conditional formatting
	me._colorCode = 'blue';
	me._displayedColor = 'blue'
	me._colorArray = 1;  //abusing JS duck typing here.  ;-)
	
	//Part 8 Guide Lines
	me._enableGuideLines = false;
	me._enableGuideRing = false;
	me._ringColorCode = 'blue';
	me._ringThickness = 2;
	me._bracketThickness = 2;
	me._ringStartAngleDeg = 0.0;
	me._ringEndAngleDeg = 360.0;
	
	
	//Validate the Inner and Outer Radii
	me.validateRadii = function(inner, outer) {
		if (inner <= outer) {
			return true;
		} else {
			return false;
		}
	};
	
	
	//Recalculate Outer Radius.  Also, double check that the new value fits with me._innerRad
	me.recalculateOuterRadius = function(paddingLeft, paddingRight, paddingTop, paddingBottom){
		// Find the larger left/right padding
		var lrPadding = paddingLeft + paddingRight;
		var tbPadding = paddingTop + paddingBottom;
		var maxPadding = lrPadding;
		if (maxPadding < tbPadding){
			maxPadding = tbPadding
		}			
		var newOuterRad = (me.$().width() - 2*(maxPadding))/2;
		var isValid = me.validateRadii(me._innerRad, newOuterRad);
		if (isValid === true){
			me._outerRad = newOuterRad;
			return true;
		}
		else {
			return false;
		}
	}

	//Getters and Setters
	me.enableArc = function(value) {
		if (value === undefined) {
			return me._enableArc;
		} else {
			me._enableArc = value;
			me.redraw();
			return me;
		}
	};
	
	//Getters and Setters
	me.colorCode = function(value) {
		if (value === undefined) {
			return me._colorCode;
		} else {
			me._colorCode = value;
			me.redraw();
			return me;
		}
	};
	
	me.innerRad = function(value) {
		if (value === undefined) {
			return me._innerRad;
		} else {
		
			var isValid = me.validateRadii(value, me._outerRad);
			if (isValid === false){
				alert("Warning!  The gauge arc can't have a small inner radius than outer!  Inner Radius must be equal to or less than " + me._outerRad);
				alert("Please decrease the inner radius, or increase the size of the control.  Height & width (including subtraction for padding) must me at least twice as large as Internal Radius!");
			} else {
				me._innerRad = value;
				me.redraw();
			}
			return this;
		}
	};
	
	me.endAngleDeg = function(value) {
		if (value === undefined) {
			return me._endAngleDeg;
		} else {
			me._endAngleDeg = value;
			me.recalculateCurrentAngle();
			return this;
		}
	};

	me.startAngleDeg = function(value) {
		if (value === undefined) {
			return me._startAngleDeg;
		} else {
			me._startAngleDeg = value;
			me.recalculateCurrentAngle();
			return this;
		}
	};
	
	me.currentAngle = function(value) {
		if (value === undefined) {
			return me._endAngleDeg;
		} else {
			me._endAngleDeg = value;
			me.recalculateCurrentAngle();
			return this;
		}
	};
	
	me.paddingTop = function(value) {
		if (value === undefined) {
			return me._paddingTop;
		} else {
			var isValid =me.recalculateOuterRadius(me._paddingLeft, me._paddingRight, value, me._paddingBottom);
			if (isValid === false){
				alert("Warning!  The gauge arc can't have a small inner radius than outer!  Outer Radius must be equal to or greater than " + me._innerRad);
				alert("Please decrease the inner radius, or increase the size of the control.  Height & width (including subtraction for padding) must me at least twice as large as Internal Radius!");
			} else {
				me._paddingTop = value;
				me.redraw();
			}
			return this;
		}
	};
	
	me.paddingBottom = function(value) {
		if (value === undefined) {
			return me._paddingBottom;
		} else {
			var isValid = me.recalculateOuterRadius(me._paddingLeft, me._paddingRight, me._paddingTop, value);
			if (isValid === false){
				alert("Warning!  The gauge arc can't have a small inner radius than outer!  Outer Radius must be equal to or greater than " + me._innerRad);
				alert("Please decrease the inner radius, or increase the size of the control.  Height & width (including subtraction for padding) must me at least twice as large as Internal Radius!");
			} else {
				me._paddingBottom = value;
				me.redraw();
			}
			return this;
		}
	};
	
	me.paddingLeft = function(value) {
		if (value === undefined) {
			paddingLeft = me._paddingLeft;
			return paddingLeft;
		} else {
			var isValid = me.recalculateOuterRadius(value, me._paddingRight, me._paddingTop, me._paddingBottom);
			if (isValid === false){
				alert("Warning!  The gauge arc can't have a small inner radius than outer!  Outer Radius must be equal to or greater than " + me._innerRad);
				alert("Please decrease the inner radius, or increase the size of the control.  Height & width (including subtraction for padding) must me at least twice as large as Internal Radius!");
			} else {
				me._paddingLeft = value;
				me.redraw();
			}
			return this;

		}
	};
	
	me.paddingRight = function(value) {
		if (value === undefined) {
			paddingRight = me._paddingRight;
		} else {
			var isValid = me.recalculateOuterRadius(me._paddingLeft, value, me._paddingTop, me._paddingBottom);
			if (isValid === false){
				alert("Warning!  The gauge arc can't have a small inner radius than outer!  Outer Radius must be equal to or greater than " + me._innerRad);
				alert("Please decrease the inner radius, or increase the size of the control.  Height & width (including subtraction for padding) must me at least twice as large as Internal Radius!");
			} else {
				me._paddingRight = value;
				me.redraw();
			}
			return this;
		}
	};
	
	//New with Part 6 
	me.useMeasures = function(value) {
		if (value === undefined) {
			return me._useMeasures;
		} else {
			me._useMeasures = value;
			me.recalculateCurrentAngle();
			return this;
		}
	};
	
	me.endAngleDegMax = function(value) {
		if (value === undefined) {
			return me._endAngleDegMax;
		} else {
			me._endAngleDegMax = value;
			me.recalculateCurrentAngle();
			return this;
		}
	};

	
	me.measureMax = function(value) {
		if (value === undefined) {
			return me._measureMax;
		} else {
			if (value >= me._measureMin){
				me._measureMax = value;
				me.recalculateCurrentAngle();
			}
			else{
				alert("The maximum displayed value of the measure must be greater then the minimum!");
			}
			return this;
		}
	};
	
	me.measureMin = function(value) {
		if (value === undefined) {
			return me._measureMin;
		} else {
			if (value <= me._measureMax){
				me._measureMin = value;
				me.recalculateCurrentAngle();
			}
			else{
				alert("The maximum displayed value of the measure must be greater then the minimum!");
			}
			return this;
		}
	};
	
	me.measureVal = function(value) {
		if (value === undefined) {
			return me._measureVal;
		} else {
			me._measureVal = value;
			me.recalculateCurrentAngle();
			return this;
		}
	};
	
	
	me.colorArray = function(value) {
		if (value === undefined) {
			return me._colorArray;
		} else {
			me._colorArray = value;
			me.redraw();
			return this;
		}
	};
	
	
	// Part 8
	me.enableGuideLines = function(value) {
		if (value === undefined) {
			return me._enableGuideLines;
		} else {
			me._enableGuideLines = value;
			me.redraw();
			return this;
		}
	};
	
	me.bracketThickness = function(value) {
		if (value === undefined) {
			return me._bracketThickness;
		} else {
			me._bracketThickness = value;
			me.redraw();
			return this;
		}
	};
	
	me.guideColorCode = function(value) {
		if (value === undefined) {
			return me._guideColorCode;
		} else {
			me._guideColorCode = value;
			me.redraw();
			return this;
		}
	};
	
	me.enableGuideRing = function(value) {
		if (value === undefined) {
			return me._enableGuideRing;
		} else {
			me._enableGuideRing = value;
			me.redraw();
			return this;
		}
	};
	
	me.ringColorCode = function(value) {
		if (value === undefined) {
			return me._ringColorCode;
		} else {
			me._ringColorCode = value;
			me.redraw();
			return this;
		}
	};
	
	me.ringThickness = function(value) {
		if (value === undefined) {
			return me._ringThickness;
		} else {
			me._ringThickness = value;
			me.redraw();
			return this;
		}
	};
	
	me.ringStartAngleDeg = function(value) {
		if (value === undefined) {
			return me._ringStartAngleDeg;
		} else {
			me._ringStartAngleDeg = value;
			me.redraw();
			return this;
		}
	};
	
	me.ringEndAngleDeg = function(value) {
		if (value === undefined) {
			return me._ringEndAngleDeg;
		} else {
			me._ringEndAngleDeg = value;
			me.redraw();
			return this;
		}
	};
	
	// End Part 8 Properties
	
	
	//Recolors the gauge, using the bottommost valid conditional formatting rule
	//   and defaulting to me._colorCode if no conditions are met. 
	me.recolor = function() {

		// Always default to the color defined in the Color property of the properties pane
		//   If no conditional formatting rules are met, then this will be the color that we use.
		var formattingColor = me._colorCode;
		
		if (me._colorArray != undefined){
			var index;
			for (index = 0; index < me._colorArray.length; index++){
				var conditionalFormattingRule = me._colorArray[index];
				if (conditionalFormattingRule.threshold <= me._measureVal){
					formattingColor = conditionalFormattingRule.colorID;
				}
			}
			
			//Only update me._displayedColor (and trigger a redraw) if the color is actually 
			if (formattingColor != me._displayedColor){
				me._displayedColor = formattingColor;
				me.redraw();
			}
		}
		return this;
	}
	
	
	me.redraw = function() {

		var myDiv = me.$()[0];
		
		//What color should we use?
		me.recolor();
		
		//Make sure that the guide line angles are correct
		me.recalculateGuideRingAngles();
		
		// Clear any existing gauges.  We'll redraw from scratch
		d3.select(myDiv).selectAll("*").remove();  
		var vis = d3.select(myDiv).append("svg:svg").attr("width", "100%").attr("height", "100%");
		var pi = Math.PI;
		
		if (me._enableArc == true){
			
			
			// Find the larger left/right padding
			var lrPadding = me._paddingLeft + me._paddingRight;
			var tbPadding = me._paddingTop + me._paddingBottom;
			var maxPadding = lrPadding;
			if (maxPadding < tbPadding){
				maxPadding = tbPadding
			}			
			
			//Determine the smallest of the x and y axes.
			var smallAxis = me.$().width();
			if (smallAxis > me.$().height()) {
				smallAxis = me.$().height();
				
			}
			
			me._outerRad = (smallAxis - 2*(maxPadding))/2;
			
			//Don't let the innerRad be greater than outer rad
			if (me._outerRad <= me._innerRad){
				alert("Warning!  The gauge arc can't have a negative radius!  Please decrease the inner radius, or increase the size of the control.  Height & width (including subtraction for padding) must me at least twice as large as Internal Radius!");
			} 
			
			//The offset will determine where the center of the arc shall be
			me._offsetLeft = me._outerRad + me._paddingLeft;
			me._offsetDown = me._outerRad + me._paddingTop;
			
			var arcDef = d3.svg.arc()
				.innerRadius(me._innerRad)
				.outerRadius(me._outerRad)
				.startAngle(me._startAngleDeg * (pi/180)) //converting from degs to radians
				.endAngle(me._endAngleDeg * (pi/180)); //converting from degs to radians
	
			var guageArc = vis.append("path")
			    .style("fill", me._displayedColor)
			    .attr("width", me.$().width()).attr("height", me.$().height()) // Added height and width so arc is visible
			    .attr("transform", "translate(" + me._offsetLeft + "," + me._offsetDown + ")")
			    .attr("d", arcDef);
		}
		
		//Part 8 - The guide lines
		///////////////////////////////////////////	
		//Lets build a border ring around the gauge
		///////////////////////////////////////////
		if (me._enableGuideLines == true){
			var visRing = d3.select(myDiv).append("svg:svg").attr("width", "100%").attr("height", "100%");
			
			var ringOuterRad = me._outerRad + ( -1 * me._ringThickness);  //Outer ring starts at the outer radius of the inner arc
	
			var ringArcDefinition = d3.svg.arc()
				.innerRadius(me._outerRad)
				.outerRadius(ringOuterRad)
				.startAngle(me._ringStartAngleDeg * (pi/180)) //converting from degs to radians
				.endAngle(me._ringEndAngleDeg * (pi/180)) //converting from degs to radians
	
			var ringArc = vis
				.append("path")
				.attr("d", ringArcDefinition)
				.attr("fill", me._ringColorCode)
				.attr("transform", "translate(" + me._offsetLeft + "," + me._offsetDown + ")");
		}
		///////////////////////////////////////////
		//Lets build a the start and end lines
		///////////////////////////////////////////
		if (me._enableGuideRing == true){
			var visStartBracket = d3.select(myDiv).append("svg:svg").attr("width", "100%").attr("height", "100%");
			var lineData = [endPoints (me._outerRad, me._ringStartAngleDeg), {x:me._offsetLeft, y:me._offsetDown}, endPoints (me._outerRad, me._ringEndAngleDeg)];
			var lineFunction = d3.svg.line()
				.x(function(d) { return d.x; })
				.y(function(d) { return d.y; })
				.interpolate("linear");
										
			var borderLines = vis
				.attr("width", me.$().width()).attr("height", me.$().height()) // Added height and width so line is visible
				.append("path")
				.attr("d", lineFunction(lineData))
				.attr("stroke", me._ringColorCode)
				.attr("stroke-width", me._bracketThickness)
				.attr("fill", "none");	
		}
	};
	
	
	me.init = function() {
		me.redraw();
	};
	
	
	//Getters for the height and width of the component
	me.getWidth = function(){
		return me.$().width();
	};
	
	me.getHeight = function(){
		return me.$().height();
	};
	
	//New with Part 6
	me.recalculateCurrentAngle = function(){
		if (me._useMeasures == true){
			//Firstly, ensure that we can turn in a clockwise manner to get from startAngleDeg to endAngleDegMax
			while (me._endAngleDeg < me._startAngleDeg){
				me._endAngleDegMax = me.me._endAngleDegMax + 360.0;
			}
			
			var currEnd = 0.0;
			if (me._measureVal > me._measureMax){
				currEnd = me._endAngleDegMax;
			} 
			else if (me._measureVal  < me._measureMin){
				currEnd = me._startAngleDeg;
			} else{
				var measureDelta = me._measureMax - me._measureMin;
				var measureValNormalized = 0.0;
				if (measureDelta >  measureValNormalized){
					var measureValNormalized = me._measureVal / measureDelta;
				}
				currEnd = me._startAngleDeg + (measureValNormalized * (me._endAngleDegMax - me._startAngleDeg))
			}
			
			if (currEnd >  me._endAngleDegMax){
				currEnd = me._endAngleDegMax;
			} 
	
			//Now set me._endAngleDeg
			me._endAngleDeg = currEnd;
		}		
		else {
			//Right now, this gauge is hardcoded to turn in a clockwise manner. 
			//  Ensure that the arc can turn in a clockwise direction to get to the end angles
			while (me._endAngleDeg < me._startAngleDeg){
				me._endAngleDeg = me._endAngleDeg + 360.0;
			}
			
			//Ensure that endAngleDeg falls within the range from startAngleDeg to endAngleDegMax
			while (me._endAngleDeg > me._endAngleDegMax){
				me._endAngleDegMax = me._endAngleDegMax + 360.0;
			}
		}
		me.redraw();
	};
	
	
	//New with Part 8
	me.recalculateGuideRingAngles = function(){
		//The ring has no max angle or measures, so it is trivial to recalculate.
		//Right now, this gauge is hardcoded to turn in a clockwise manner. 
		//  Ensure that the arc can turn in a clockwise direction to get to the end angles
		while (me._ringEndAngleDeg < me._ringStartAngleDeg){
			me._ringEndAngleDeg = me._ringEndAngleDeg + 360.0;
		}
	};
	
	
	//Helper function	
	function endPoints (lineLength, lineAngle){
		var pi = Math.PI;
		var endX = me._offsetLeft - (lineLength * Math.sin(lineAngle * (pi/180)));
		var endY = me._offsetDown - (lineLength * Math.cos(lineAngle * (pi/180)));
		return {x:endX, y:endY}
	}

});