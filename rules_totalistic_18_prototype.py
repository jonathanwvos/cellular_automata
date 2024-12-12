from os.path import join

import numpy as np
import cv2


# WIDTH = 1919
# MID_POINT = 960
# NO_STEPS = 1080

WIDTH = 80
MID_POINT = 50
NO_STEPS = 100

order = 18
length = order**3

def probabilitic_nary_counter(length: int, num: int):
    return np.random.choice(range(0, num), length)

for rule_no in range(5000):
    im = np.ndarray((NO_STEPS, WIDTH), dtype='int16')
    im[:,:] = order-1
    im[0, MID_POINT] = 0

    rule = probabilitic_nary_counter(length, order)

    for step in range(1, NO_STEPS):
        for i in range(1, WIDTH-1):
            # index = im[step-1, i-1:i+2].join(';')
            x,y,z = im[step-1, i-1:i+2]
            index = x*(order**2)+y*(order)+z
            im[step, i] = rule[index]

    im = (im.astype('float16')/(order-1))*255
    im = cv2.resize(im, (1000, 1000), interpolation=cv2.INTER_NEAREST)
    cv2.imwrite(join('rules_18_totalistic_low_res', f'{rule_no}.jpg'), im)
