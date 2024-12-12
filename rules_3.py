from os.path import join

import numpy as np
import cv2


# WIDTH = 1919
# MID_POINT = 960
# NO_STEPS = 1080

WIDTH = 80
MID_POINT = 50
NO_STEPS = 100


for rule_no in range(256):
    im = np.ndarray((NO_STEPS, WIDTH), dtype='uint8')
    im[:,:] = 1
    im[0, MID_POINT] = 0

    rule = np.binary_repr(rule_no, 8)

    for step in range(1, NO_STEPS):
        for i in range(1, WIDTH-1):
            im[step, i] = rule[np.packbits(im[step-1, i-1:i+2], bitorder='little')[0]]

    im = im*255
    im = cv2.resize(im, (1000, 1000), interpolation=cv2.INTER_NEAREST)
    cv2.imwrite(join('rules_3_results', f'{rule_no}.jpg'), im)
