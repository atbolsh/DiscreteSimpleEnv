reward = 0;

x = 200;
y = 600;
r = 40;

gold_r = 10;

gold = [[300, 300], [303, 307], [295, 301], [297, 296]];

wall = [
[0, 0, 50, 800, 0], 
[0, 0, 800, 50, 0],
[0, 800 - 50, 800, 50, 0], /* I know it's 750, doing this for clarity */
[800 - 50, 0, 50, 800, 0]
];
