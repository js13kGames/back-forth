
export function SATCollision(poly1,poly2){
      let s1 = new Shape(poly1),
          s2 = new Shape(poly2);
     return s1.checkCollision(s2);  
}

function Shape(points, x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.points = points || [];   
    this.getNormals();
    this.getMedians();
}


Shape.prototype.getNormals = function () {
    var p = this.points,
        n = p.length,
        crt, nxt, l, x1, y1;

    this.normals = [];
    for (var i = 0; i < n; i++) {
        crt = p[i];
        nxt = p[i + 1] || p[0];
        x1 = (nxt.y - crt.y);
        y1 = -(nxt.x - crt.x);
        l = Math.sqrt(x1 * x1 + y1 * y1);
        this.normals[i] = {x: x1 / l, y: y1 / l};
        this.normals[n + i] = {x: - x1 / l, y: - y1 / l};
    }
};

Shape.prototype.getMedians = function () {
    var p = this.points,
        crt, nxt;

    this.medians = [];

    for (var i = 0; i < p.length; i++) {
        crt = p[i];
        nxt = p[i + 1] || p[0];
        this.medians.push({x: (crt.x + nxt.x) / 2, y: (crt.y + nxt.y) / 2});
    }
};

Shape.prototype.checkCollision = function (shape) {
    var me = this,
        p1, p2;

    return me.normals.concat(shape.normals).every(function (v) {
        p1 = me.project(v);
        p2 = shape.project(v);
        return (((p1.min <= p2.max) && (p1.max >= p2.min)) ||
        (p2.min >= p1.max) && (p2.max >= p1.min));
    });
};

Shape.prototype.project = function (vector) {
    var me = this,
        p = this.points,
        min = Infinity, max = -Infinity,
        x, y, proj;

    p.forEach(function (p) {
        x = me.x + p.x;
        y = me.y + p.y;
        proj = (x * vector.x + y * vector.y);
        min = proj < min ? proj : min;
        max = proj > max ? proj : max;
    });

    return {min: min, max: max};
};
