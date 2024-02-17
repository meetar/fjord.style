---
layout: page
title: Voxelizer
published: true
---

<style>
  video {
    width: 100%;
  }
  .post-content > p > img {
    margin-bottom: 20px;
  }
</style>



Voxelizer 1.0 is a script written in Python for Maya. It builds an array of animated cubes in the shape of selected target objects. It takes the color of the cubes from the texture and lighting of the object, and respects visibility and transparency. It also allows keyable voxel and gap sizes, by checking the sizes of optional control objects.

<div style="padding:100% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/13045902?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Voxelizer 1.0"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<div style="padding:100% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/12050211?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Color Cubes 02"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<div style="padding:100% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/9720642?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Small Ogre Blocks"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<br>
Download files here:
- [Voxelizer1.0.py](/files/Voxelizer1.0.py)
- [Voxelizer1.0_test.ma (Maya 2010)](/files/Voxelizer1.0_test.ma)

Instructions and code follow:

### Usage notes:

Copy this script and paste into a Python tab in Maya, select target meshes and execute (with ctrl-enter in Windows). Optionally, paste the code into the script editor, select all, and drag to the shelf to create a button.

If nothing is selected, if a group called “voxelGeo” exists the meshes inside it will be used as the targets.
If an object named “voxelScaleCtrl” exists, the voxel system will take its scale value from it.
If an object named “cubeScaleCtrl” exists, each cube will take its scale value from it.

The script samples color and alpha values, but only one value per face; for higher resolution color sampling, subdivide your mesh’s faces.

This script will result in one shader per face; if you run the script more than once, optimize your scene with File > Optimize Scene Size to remove unused nodes.

Maya’s color sampling routines may have trouble with multiple shadow-casting lights; this may depend in part on your video card.

Performance toggles:
“Verbose output” will print performance statistics during execution.
“Show Maya messages” will allow the display of any errors and command results.
“Profiling” will enable the Python profiler and display detailed statistics about function usage at the end of execution.
“Disable undo” if you’re running out of memory during execution. The script will re-enable undo afterward (if it was on in the first place.)

My machine voxelizes the test scene in about 13 minutes, which is still fairly slow. I’d love to get it as fast as Robert Leger’s Cimea 4D Voxels Preset, I’m afraid that’s going to have to be a C++ plugin… watch this space.

<span class="aside">This post was originally published at <http://zoomy.net/2010/07/03/voxelizer-1-0/>.</span>