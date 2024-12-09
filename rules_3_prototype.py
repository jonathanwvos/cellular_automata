import numpy as np
import cv2

WIDTH = 1919
MID_POINT = 960
NO_STEPS = 1080

# WIDTH = 99
# MID_POINT = 50
# NO_STEPS = 100

def rule250(arr):
    if (arr[0] == arr[2] == 1 and arr[1] == 0 ) or (sum(arr) == 3):
        return 1
    else:
        return 0

def rule90(arr):
    if np.array_equal(arr, np.array([0,0,0],dtype='uint8')):
        return 1
    elif np.array_equal(arr, np.array([0,0,1],dtype='uint8')):
        return 0
    elif np.array_equal(arr, np.array([0,1,0],dtype='uint8')):
        return 1
    elif np.array_equal(arr, np.array([0,1,1],dtype='uint8')):
        return 0
    elif np.array_equal(arr, np.array([1,0,0],dtype='uint8')):
        return 0
    elif np.array_equal(arr, np.array([1,0,1],dtype='uint8')):
        return 1
    elif np.array_equal(arr, np.array([1,1,0],dtype='uint8')):
        return 0
    elif np.array_equal(arr, np.array([1,1,1],dtype='uint8')):
        return 1

im = np.ndarray((NO_STEPS, WIDTH), dtype='uint8')
im[:,:] = 1
im[0, MID_POINT] = 0

for step in range(1, NO_STEPS):
    for i in range(1, WIDTH-1):
        im[step, i] = rule90(im[step-1, i-1:i+2])

im = cv2.resize(im, (1000, 1000), interpolation=cv2.INTER_NEAREST)
cv2.imshow('Cellular Automata', im*255)
cv2.waitKey(0)