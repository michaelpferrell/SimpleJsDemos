class parabola {
    constructor(AIn, BIn, CIn) {
        this.a = AIn ?? 1;
        this.b = BIn ?? 0;
        this.c = CIn ?? 0;
    }

    at(XIn) {
        return this.a*XIn*XIn + this.b*XIn + this.c;
    }
}

//Cartesian plane with conversion to physical coords, independent of how points are used
class LogicalCartesianPlane {
    constructor(logicalcoordsin, physicalcoordsin) {
        this.logicalcoords = logicalcoordsin;
        this.physicalcoords = physicalcoordsin;
        const lc = this.logicalcoords;
        this.lx2pxfactor = (this.physicalcoords.right - this.physicalcoords.left)/
                (lc.right - lc.left);
        this.ly2pyfactor = (this.physicalcoords.top - this.physicalcoords.bottom)/
                (lc.top - lc.bottom);
        this.xr = {"min": lc.left, "max": lc.right};
        this.yr = {"min": lc.bottom, "max": lc.top};
    }

    lx2px(lxin) {
        return ((lxin - this.logicalcoords.left)*this.lx2pxfactor) + this.physicalcoords.left;
    }

    ly2py(lyin) {
        return ((lyin - this.logicalcoords.bottom)*this.ly2pyfactor) + this.physicalcoords.bottom;
    }
}

class PlottingSurface {
    constructor(logicalplanein, contextin) {
        this.logicalplane = logicalplanein;
        this.context = contextin;
    }

    moveTo(xin, yin) {
        this.context.moveTo(this.logicalplane.lx2px(xin), this.logicalplane.ly2py(yin));
    }

    lineTo(xin, yin) {
        this.context.lineTo(this.logicalplane.lx2px(xin), this.logicalplane.ly2py(yin));
    }

    drawLine(x1in, y1in, x2in, y2in) {
        this.moveTo(x1in, y1in);
        this.lineTo(x2in, y2in);    
    }

    getxr() {
        return this.logicalplane.xr;
    }

    getyr() {
        return this.logicalplane.yr;
    }
}

function DrawAxes(psin) {
    const ctx = psin.context;
    const xr = psin.getxr();
    const yr = psin.getyr();
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    psin.drawLine(0, yr.min, 0, yr.max);
    psin.drawLine(xr.min, 0, xr.max, 0);
    ctx.stroke();
}

function DrawParabola(parabin, psin) {
    const ctx = psin.context;
    const xr = psin.getxr();
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    psin.moveTo(xr.min, parabin.at(xr.min));
    for(var x=xr.min; x<=xr.max; x++)
    {
        y = parabin.at(x);
        psin.lineTo(x, y);
    }
    ctx.stroke();
}

const canvas = document.getElementById("Parab1");
const ctx = canvas.getContext("2d");
const physicalcoords = { left: 0, top: 0, right: canvas.width-1, bottom: canvas.height-1 };
const logicalcoords = { left: -20, top: 400, right: 20, bottom: -100 };
const lp = new LogicalCartesianPlane(logicalcoords, physicalcoords)
const ps = new PlottingSurface(lp, ctx);
const myParab = new parabola(1);

DrawAxes(ps);
DrawParabola(myParab, ps);
