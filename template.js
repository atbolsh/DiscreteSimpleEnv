reward = 0; /* initial reward, default 0. */

x = _; /* initial x-position of agent */
y = _; /* initial y-position of agent*/
r = 40; /* agent radius, default 40 pixels*/

gold_r = 10; /* default gold coin radius */

gold = [[_, _], [_, _]]; /* array of gold coin positions.*/


/* array of wall parameters, 5 args.
First 2 are top left corner coordinates, second 2 are width and height, 
then rotation clockwise (negative for counterclockwise).
Rotation is around top left corner. */
wall = [[_, _, _, _, _], [_, _, _, _, _]]; 


