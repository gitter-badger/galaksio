import sys
import os

os.chdir(os.path.dirname(os.path.realpath(__file__)) + "/../")
sys.path.insert(0, os.path.abspath(os.path.curdir))

isFirstLaunch = False

if not os.path.isfile(os.path.dirname(os.path.realpath(__file__)) + "/conf/serverconf.py"):
    import shutil
    conf_dir = os.path.dirname(os.path.realpath(__file__)) + "/conf/"
    shutil.copyfile(conf_dir + "example_serverconf.py", conf_dir + "serverconf.py")
    isFirstLaunch = True

from server.server import Application

application = Application()
application.isFirstLaunch = isFirstLaunch
app = application.app

application.launch()