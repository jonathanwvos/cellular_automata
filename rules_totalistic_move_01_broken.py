from os import mkdir

import numpy as np
import cv2
import argparse

ap = argparse.ArgumentParser()
ap.add_argument(
    '-w',
    '--width',
    help='The width of the image to generate.',
    required=True,
    default=80
)
ap.add_argument(
    '-s',
    '--steps',
    help='The number of steps (height) to run the automata for.',
    required=True,
    default=100
)
ap.add_argument(
    '-o',
    '--order',
    help='The order of the cellular automata.',
    required=True
)
ap.add_argument(
    '-n',
    '--no-im',
    help='The number of automata to generate.',
    required=True
)
args = ap.parse_args()
width = int(args.width)
steps = int(args.steps)
order = int(args.order)
no_im = int(args.no_im)

LENGTH = order**3
MID_POINT = width//2

def probabilitic_nary_counter(length: int, num: int):
    return np.random.choice(range(0, num), length)

# # Make output folder
# output_dir = f'rules_{order}_totalistic_move_01'
# try:
#     mkdir(output_dir)
# except FileExistsError:
#     print(f'{output_dir} already exist.')

for rule_no in range(no_im):
    im = np.ndarray((steps, width), dtype='int16')
    im[:,:] = order-1
    im[0, MID_POINT] = 0
    
    # probabilitic n-ary counter
    rule = np.random.choice(range(0, order), LENGTH)

    for step in range(1, steps):
        for i in range(1, width-1):
            x,y,z = im[step-1, i-1:i+2]
            index = x*(order**2)+y*(order)+z
            im[step, i] = rule[index]

    im = (im.astype('float16')/(order-1))*255
    try:
        im = cv2.resize(im, (1000, 1000), interpolation=cv2.INTER_NEAREST)
        cv2.imwrite(join('tmp', f'{rule_no}.jpg'), im)
    except:
        print('It broke.')
