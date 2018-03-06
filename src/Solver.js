import Solution from "./Solution";

export default class Solver {
    constructor(model) {
        this.model = model;
        this.iid = -1;
        this.onStateChange = null;
    }

    fireStateChange() {
        if (this.onStateChange != null) {
            this.onStateChange();
        }
    }

    handleModelUpdate() {
        if (this.isSolving()) {
            this.cancelSolve(true);
            this.beginSolve(true);
        } else {
            this.beginSolve();
        }
    }

    isSolving() {
        return this.iid >= 0;
    }

    cancelSolve(suppressEvents = false) {
        clearInterval(this.iid);
        this.iid = -1;
        this.solveIterative = this.solve_fail;
        if (!suppressEvents) {
            this.fireStateChange();
        }
    }

    beginSolve(suppressEvents = false) {
        this.solveIterative = this.solve_modelInit;
        this.iid = setInterval(() => {
            if (this.solveIterative()) {
                this.cancelSolve();
            }
        }, 0);
        if (!suppressEvents) {
            this.fireStateChange();
        }
    }

    getSolution() {
        if (this.solutions) {
            return this.solutions[this.solutions.length - 1];
        } else {
            return null;
        }
    }

    solve_fail() {
        console.error("Solver.solveIterative() called directly");
        return true;
    }

    solveIterative() {
        return this.solve_fail();
    }

////////////////////////////////////////////////////////////////////////////////

    solve_modelInit() {
        this.solutions = [
            new Solution(this.model)
        ];
        this.closest = this.solutions[0];
        this.closestAmount = -1;
        this.solveIterative = this.solve_trySolveWithLogic;
        return false;
    }

    solve_trySolveWithLogic() {
        const solution = this.solutions[this.solutions.length - 1];
        if (!solution.trySolveWithLogic()) {
            const amount = solution.amountSolved();
            if (amount > this.closestAmount) {
                this.closest = this.solutions[this.solutions.length - 1];
                this.closestAmount = amount;
            }
            this.solveIterative = this.solve_guess;
        }
        return solution.isSolved();
    }

    solve_guess() {
        const solution = new Solution(null, this.solutions[this.solutions.length - 1]);
        if (solution.guess()) {
            this.solutions.push(solution);
            this.solveIterative = this.solve_trySolveWithLogic;
            return solution.isSolved();
        } else if (this.solutions.length > 1) {
            console.log("Guess failed to work.");
            this.solutions.pop();
            return false;
        } else {
            console.error("Unable to solve.");
            this.solutions = [ this.closest ];
            return true;
        }
    }

////////////////////////////////////////////////////////////////////////////////

}
