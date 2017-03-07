var argv = require('yargs')
    .usage('Usage: node $0 --l=[num] --b=[num]')
    .demand(['l [lenght]','b [breadth]'])
    .argv;

var rect = require('./rectangle-2');

function solveRect(l,b) {
    console.log("\nSolving for rectangle with l = " + l + " and b = " + b + "...");
    rect(l,b, function(err,rectangle) {
        if (err) {
            console.log(err + "\n");
        }
        else {
            console.log("- The area of a rectangle of dimensions length = "
                        + l + " and breadth = " + b + " is " + rectangle.area());
            console.log("- The perimeter of a rectangle of dimensions length = "
                        + l + " and breadth = " + b + " is " + rectangle.perimeter() + "\n");
        }
    });
};

solveRect(argv.l,argv.b);