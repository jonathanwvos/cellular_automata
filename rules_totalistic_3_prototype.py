from os.path import join

import numpy as np
import cv2


# WIDTH = 1919
# MID_POINT = 960
# NO_STEPS = 1080

WIDTH = 80
MID_POINT = 50
NO_STEPS = 100


def product(*iterables, repeat=1):
    # product('ABCD', 'xy') → Ax Ay Bx By Cx Cy Dx Dy
    # product(range(2), repeat=3) → 000 001 010 011 100 101 110 111

    if repeat < 0:
        raise ValueError('repeat argument cannot be negative')
    pools = [tuple(pool) for pool in iterables] * repeat

    result = [[]]
    for pool in pools:
        result = [x+[y] for x in result for y in pool]

    for prod in result:
        yield tuple(prod)

print(list(product([0,0.5,1], repeat=27)))

# product([0,0.5,1], repeat=3)

# def rule_3_totalistic_gen():
#     rule = np.zeros(3)
    
#     for i1, v1 in enumerate(np.arange(0, 1.5, 0.5)):
#         rule[i1] = v1
#         for i2, v2 in enumerate(np.arange(0, 1.5, 0.5)):
#             rule[i2] = v2
#             for i3, v3 in enumerate(np.arange(0, 1.5, 0.5)):
#                 rule[i3] = v3
        
#                 yield rule     


# for rule_no in range(256):
#     im = np.ndarray((NO_STEPS, WIDTH), dtype='float16')
#     im[:,:] = 1
#     im[0, MID_POINT] = 0
    
#     rule = np.binary_repr(rule_no, 8)

#     for step in range(1, NO_STEPS):
#         for i in range(1, WIDTH-1):
#             index = im[step-1, i-1:i+2].join(';')
#             im[step, i] = rule[np.packbits(im[step-1, i-1:i+2], bitorder='little')[0]]

#     im = im*255
#     im = cv2.resize(im, (1000, 1000), interpolation=cv2.INTER_NEAREST)
#     cv2.imwrite(join('rules_3_results', f'{rule_no}.jpg'), im)
