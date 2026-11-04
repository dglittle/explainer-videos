const SCRIPT=[
['talked about the epr',"In an earlier video, I talked about the EPR paradox, a famous bit of quantum weirdness that really happens. This time, I just want to show how that real setup turns into matrix math.",1.0],
['one for alice',"We have two qubits, one for Alice and one for Bob, both starting at 0. In the math, that's a vector of 4 numbers, with a 1 at 00.",1.0],
['tie them together',"Then two gates tie them together. The first one makes Alice's qubit 50/50 between 0 and 1, like the slit gate from last time.",0.8],
['right below it',"Each gate is a 4 by 4 matrix, and we multiply the way we did in the matrix video: the matrix goes above, and the result goes right below it.",2.2],
['copies alice',"The second gate copies Alice's qubit onto Bob's, like the spy gate: it flips Bob's qubit whenever Alice's is a 1. Now the vector is half 00 and half 11.",2.0],
['far apart',"Then Alice and Bob carry their qubits far apart.",0.8],
['turn their qubit',"Each of them has three buttons, which turn their qubit by some angle, like a polarizer, and then they look. That's one more matrix, which depends on the buttons they pressed.",2.2],
['squared and added',"And in the result, the chance that they see the same thing is right here: the 00 and 11 numbers, squared and added up.",2.4],
['same button',"If they press the same button, that's 100%.",2.8],
['neighboring buttons',"Neighboring buttons give about 85%.",2.6],
['top and bottom buttons',"And the top and bottom buttons give 50%, just like in the real experiment.",2.2],
['few matrices',"So that famous experiment is really just a vector of 4 numbers, times a few matrices.",5.0]];
