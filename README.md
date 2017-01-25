# Graphs and Tracks

**Graphs and Tracks** by [David Trowbridge](https://github.com/davidtro) is based upon research and curriculum development by the Physics Education Group at the University of Washington, and educational software design at the Educational Technology Center at the University of California, Irvine. A software package **Graphs and Tracks** was developed at the Center for Design of Educational Computing at Carnegie Mellon University and at the University of Washington. In 1988, **Graphs and Tracks** was selected as Best Physics and Best Integrated Software by EDUCOM/NCRIPTAL and subsequently published by Physics Academic Software for 22 years.  

This version of **Graphs and Tracks** has been implemented by [Carlos G.](https://github.com/snolflake) as a web application using [D3.js](https://d3js.org/) and [Angular 2](https://angular.io/). The software is free to use and open source, subject to the [MIT license](LICENSE.txt).

It corresponds to _Part I: From Graphs to Motion_ of the [legacy program](https://github.com/davidtro/gt).

<a target="_blank" href="https://www.browserstack.com/" title="Cross Browser Testing Tool. 1000+ Browsers, Mobile, Real IE.">
    <img src="public/img/browserstack.png">
</a>

Thanks to <a target="_blank" href="https://www.browserstack.com/" title="Cross Browser Testing Tool. 1000+ Browsers, Mobile, Real IE.">BrowserStack</a> this app is tested and officially supported on Windows PCs and Macintoshes, as well as on tablets and smartphones running the latest versions of Android, iOS and Windows.

### NOTE TO TEACHERS

Students are introduced to the topic of graphs and motion early in their study of physics, but educational research shows that most cannot apply the concepts of position, velocity and acceleration to real motion. **Graphs and Tracks** is a goal-oriented program that underscores the connection between animated motion and graphs. It makes learning about graphs of motion a playful activity.  

**Graphs and Tracks** serves as an ideal complement to hands-on activities using real objects and motion detectors.  

Students can use the built-in Challenge Examples organized from Easy to Hard. They can visit an ever- growing collection of Community Challenges, or they can try specific challenges that you, the teacher create. Students can also challenge one another by adding their own examples to the collection. A Show Solution feature is available for students in the Challenge Examples section only.  

See the [curricula](https://depts.washington.edu/uwpeg/curricula-0) developed by the Physic Education Group at the University of Washington.  

See also [Motion Detector](http://www.vernier.com/experiments/pwv/1/graph_matching/) and activities developed by Vernier, Inc.  

**Graphs and Tracks** uses a number of simplifying assumptions to help students focus on the most important aspects of one-dimensional kinematics without getting lost in some of the complexities of real motions. These assumptions and idealizations are described below:  

1.  To help students make adjustments to their arrangements of sloping tracks, the ramps are displayed with an exaggerated vertical dimension. Thus, the ramps are shown with slopes from 0-50° from the horizontal When they represent slopes of 0-5.7°. This small-angle approximation affects acceleration values by, at most, 0.5%. The examples in **Graphs and Tracks** are treated as purely one-dimensional problems. The coordinate x is measured horizontally along the base of the ramps. Each segment of track should be thought of as having a fixed length of 100 cm.
2.  While the program refers to a “rolling” ball, in fact, acceleration values have been computed for _sliding_ point masses, not _rolling_ spheres. Treatment of solid spheres rolling without slipping, would reduce all acceleration values by 29%.
3.  While actual balls would bounce at the sharp junctions shown in the simulation, the program constrains them to remain on the ramps at all times. No account is made for the x-component of impulses that would be delivered to the ball if it were crossing junctions to steeply sloping ramps. You can think of the junctions as being smooth and rounded So that the ball never “collides” with the tracks
4.  The ball and track system is represented entirely without friction.
5.  The values of _t_ shown on the time axis do not represent real time.
