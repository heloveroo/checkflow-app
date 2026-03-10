import ActionLog from '../models/ActionLog.js';

export const logAction = (action, entity) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    if (data?.success !== false && req.user) {
      try {
        await ActionLog.create({
          user: req.user._id,
          action,
          entity,
          entityId: req.params?.id || data?.data?._id,
          details: { method: req.method, url: req.originalUrl },
          ip: req.ip,
          userAgent: req.headers['user-agent']
        });
      } catch (e) { /* silent */ }
    }
    return originalJson(data);
  };
  next();
};
