import express from 'express';

import * as InsurancePeer from '../blockchain-api/memberPeer';

router.post('/api/member/create', async (req, res) => {
    let {member} = req.body;
    if (typeof status === 'string' && status[0]) {
      status = status[0].toUpperCase();
    }
    try {
      let claims = await InsurancePeer.getClaims(status);
      res.json(claims);
    } catch (e) {
      res.json({ error: 'Error accessing blockchain.' });
    }
  });